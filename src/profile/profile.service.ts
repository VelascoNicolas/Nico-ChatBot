import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Enterprise, Profile, PrismaClient } from '@prisma/client';
import { supabase, supabaseAdmin } from "../configSupabaseClient";
import { AuthApiError } from '@supabase/supabase-js';
import { ProfileDto } from './dto/profile.dto';
import { ProfileEnterpriseDto } from './dto/profile-enterprise.dto';

@Injectable()
export class ProfileService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async signUpWithEnterprise(
    ProfileEnterprise: ProfileEnterpriseDto
  ) {
    try {
      // Verifica que el phone no exista
      const enterprisePhone: Enterprise[] =
        await this.enterprise.findMany({
          where: {
            phone: ProfileEnterprise.phone,
          },
        });

      if (enterprisePhone.length > 0) {
        throw new HttpException("Enterprise phone already registered", 409);
      }

      // Crea el profile en auth.enterprises
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: ProfileEnterprise.email,
        password: ProfileEnterprise.password,
        role: "admin",
        user_metadata: { username: ProfileEnterprise.username },
        email_confirm: true,
      });

      // Manejo de AuthApiError
      if (error instanceof AuthApiError) {
        const status =
          error.message == "Profile already registered" ? 409 : 500;
        throw new HttpException(error.message, status);
      }

      // Crea la empresa
      const empresa = await this.enterprise.create({
        data: {
          name: ProfileEnterprise.name,
          phone: ProfileEnterprise.phone,
          connected: true,
          pricingPlanId: null
        },
      })

      const profile = await this.profile.create({
        data: {
          enterpriseId: empresa.id,
        },
      });

      const userData = {
        idProfile: data.user?.id,
        createdAt: data.user?.created_at,
        username: data.user?.user_metadata.username,
        email: data.user?.email,
        role: data.user?.role,
        enterprise: {
          id: empresa.id,
          name: empresa.name,
          phone: empresa.phone,
        },
      };

      return userData;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException("Unknown error: " + error, 500);
      }
    }
  }

  async signUp(dataProfile: ProfileDto, idEnterprise?: string) {
    try {
      // Crea el profile en auth.enterprises
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: dataProfile.email,
        password: dataProfile.password,
        role: dataProfile.role,
        user_metadata: { username: dataProfile.username },
        email_confirm: true,
      });

      const newProfile: Profile = {} as Profile;
      newProfile.id = data.user?.id ?? "";
      
      // Manejo de AuthApiError
      if (error instanceof AuthApiError) {
        const status =
          error.message == "Profile already registered" ? 409 : 500;
        throw new HttpException(error.message, status);
      }

      console.log(idEnterprise);
      if (idEnterprise) {
        const enterprise = await this.enterprise.findFirst({
          where: { id: idEnterprise },
        });
        newProfile.enterpriseId = enterprise.id;
      }

      const profileSave = await this.profile.create({
        data: {
          id: newProfile.id,
          enterprise: {
            connect: {
              id: newProfile.enterpriseId,
            },
          },
        },
      });

      const showEnterprise = this.enterprise.findUnique({
        where: { id: profileSave.enterpriseId },
      })

      const userData = {
        idProfile: data.user?.id,
        createdAt: data.user?.created_at,
        username: data.user?.user_metadata.username,
        email: data.user?.email,
        role: data.user?.role,
        enterprise: showEnterprise,
      };

      return userData;
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException("Unknown error: " + error, 500);
      }
    }
  }

  public async signIn(profile: ProfileDto) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profile.email,
        password: profile.password,
      });

      if (error) {
        // TODO: Add this to handleRepositoryError
        if (error instanceof AuthApiError) {
          const status =
            error.message == 'Invalid login credentials' ? 401 : 500;
          throw new Error(error.message);
        } else {
          throw new Error(`unkonw Error: ${error.message}`);
        }
      }

      const refresToken = this.getSession();
      const userData = {
        id: data.user?.id,
        email: data.user?.email,
        token: data.session.access_token,
        refresh_token: (await refresToken).refresh_token,
      };

      return userData;
    } catch (error: unknown) {
      throw new Error(error as string);
    }
  }

  async findAllProfiles(idEnterprise: string) {
    const profiles = await this.profile.findMany({
      where: { enterpriseId: idEnterprise },
      include: { enterprise: true },
    });

    const profileData = await Promise.all(
      profiles.map(async (profile) => {
        const { data, error } = await supabase.auth.admin.getUserById(
          profile.id,
        );

        if (error) {
          throw new Error(`Error getting user data for profile ${profile.id}`);
        }

        return {
          id: profile.id,
          username: data.user?.user_metadata.username,
          email: data.user?.email,
          role: data.user?.role,
          createdAt: data.user?.created_at,
          enterpriseId: profile.enterpriseId,
        };
      }),
    );

    return {
      profiles: profileData,
    };
  }

  async findByIdProfileForEnterprise(
    idProfile: string,
    idEnterprise?: string
  ) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(
        idProfile
      );

      if (error instanceof AuthApiError) {
        throw new HttpException(
          "Error fetching profile: " + error.message,
          error.status
        );
      }

      //find one by id
      const profile = await this.profile.findFirst({
        where: {
        id: idProfile,
        enterprise: { id: idEnterprise },
        }
      });

      //cambiar en el repo
      const enterprise = await this.enterprise.findUnique({
        where: { id: idEnterprise },
      });

      if (data && profile) {
        return {
          id: data.user?.id,
          username: data.user?.user_metadata.username,
          email: data.user?.email,
          role: data.user?.role,
          createdAt: data.user?.created_at,
          enterprise,
        };
      } else {
        throw new HttpException("Profile not found", 404);
      }
    } catch (error) {
      throw Error(error);
    }
  }

  async deleteProfile(idProfile: string) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.deleteUser(
        idProfile
      );

      if (error instanceof AuthApiError) {
        throw new HttpException(
          "Profile not found: " + error.message,
          error.status
        );
      }

      if (!data) {
        throw new HttpException("Failed to delete profile in Supabase", 500);
      }

      await this.profile.delete({where: {id: idProfile}});
      return data;
    } catch (error) {
      throw Error(error);
    }
  }

  async updateProfile(updateProfileDto: UpdateProfileDto) {
    try {
      
      const {id: __, ...data} = updateProfileDto;

      const profile = await this.profile.findUnique({
        where: { id: __ },
      });

      if (!profile) {
        throw new HttpException("Profile not found", 404);
      }

      const update = await this.profile.update({
        where: { id: __ },
        data: data,
      });

      return data;

    } catch (error) {
      throw new HttpException("Failed to update profile", 500);
    }
  }

  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw new HttpException('Error getting session', 500);
      }
      return {
        token: data?.session?.access_token,
        refresh_token: data?.session?.refresh_token,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Unknown error: ' + error, 500);
      }
    }
  }

  async refreshSession(refreshToken: string) {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken,
      });
      if (error) {
        throw new HttpException('Error refreshing token', 500);
      }
      return {
        token: data?.session?.access_token,
        refresh_token: data?.session?.refresh_token,
      };
    } catch (error: unknown) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException('Unknown error: ' + error, 500);
      }
    }
  }
}
