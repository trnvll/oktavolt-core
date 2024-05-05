import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common'
import { DrizzleService } from '@/core/drizzle/drizzle.service'
import { SelectUser, Users } from 'database'
import { eq } from 'drizzle-orm'

@Injectable()
export class FindUserByIdPipe
  implements PipeTransform<number, Promise<SelectUser>>
{
  constructor(private readonly drizzle: DrizzleService) {}

  async transform(userId: number): Promise<SelectUser> {
    if (!userId) {
      throw new NotFoundException('No user ID provided.')
    }

    const user = await this.drizzle.db.query.Users.findFirst({
      where: eq(Users.userId, userId),
    })

    if (!user) {
      throw new NotFoundException('User not found.')
    }

    return user
  }
}
