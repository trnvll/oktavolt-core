import { Injectable, NotFoundException } from '@nestjs/common'
import { Preferences, SelectUser } from 'database'
import { DrizzleService } from '@/core/drizzle/drizzle.service'
import { and, eq } from 'drizzle-orm'
import { FindOnePrefDto } from '@/modules/prefs/dtos/find-one-pref.dto'
import { FindAllPrefsDto } from '@/modules/prefs/dtos/find-all-prefs.dto'
import { CreatePrefsDto } from '@/modules/prefs/dtos/create-prefs.dto'

@Injectable()
export class PrefsService {
  constructor(private readonly drizzle: DrizzleService) {}

  async findAll(user: SelectUser) {
    const prefs = await this.drizzle.db.query.prefs.findMany({
      where: eq(Preferences.userId, user.userId),
    })

    return FindAllPrefsDto.fromEntity(prefs)
  }

  async findOne(user: SelectUser, prefId: number) {
    const pref = await this.drizzle.db.query.prefs.findFirst({
      where: and(
        eq(Preferences.prefId, prefId),
        eq(Preferences.userId, user.userId),
      ),
    })

    if (!pref) {
      throw new NotFoundException('Preference not found.')
    }

    return FindOnePrefDto.fromEntity(pref)
  }

  async create(user: SelectUser, createPreferencesDto: CreatePrefsDto) {
    const entity = CreatePrefsDto.toEntity(
      user.userId,
      createPreferencesDto.data,
    )

    return this.drizzle.db
      .insert(Preferences)
      .values(entity)
      .returning({ prefId: Preferences.prefId })
  }

  /*
  async update(
    user: SelectUser,
    prefId: number,
    updatePreferencesDto: UpdatePrefsDto,
  ) {
    const pref = await this.drizzle.db.query.Preferences.findFirst({
      where: and(
        eq(Preferences.prefId, prefId),
        eq(Preferences.userId, user.userId),
      ),
    })

    if (!pref) {
      throw new NotFoundException('Preference not found.')
    }

    const updatedEntity = UpdatePrefsDto.toEntity(updatePreferencesDto.data)

    return this.drizzle.db
      .update(Preferences)
      .set(updatedEntity)
      .where(eq(Preferences.prefId, prefId))
      .returning()
  }
   */

  async delete(user: SelectUser, prefId: number) {
    const pref = await this.drizzle.db.query.prefs.findFirst({
      where: eq(Preferences.prefId, prefId),
    })

    if (!pref) {
      throw new NotFoundException('Preference not found.')
    }

    return this.drizzle.db
      .delete(Preferences)
      .where(eq(Preferences.prefId, prefId))
      .returning({ prefId: Preferences.prefId })
  }
}
