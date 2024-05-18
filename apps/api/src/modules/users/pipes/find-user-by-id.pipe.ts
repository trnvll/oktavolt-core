import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common'
import { DatabaseService } from '@/core/database/database.service'
import { SelectUser, Users } from 'database'
import { eq } from 'drizzle-orm'

@Injectable()
export class FindUserByIdPipe
  implements PipeTransform<number, Promise<SelectUser>>
{
  constructor(private readonly database: DatabaseService) {}

  async transform(userId: number): Promise<SelectUser> {
    if (!userId) {
      throw new NotFoundException('No user ID provided.')
    }

    const user = await this.database.db.query.users.findFirst({
      where: eq(Users.userId, userId),
    })

    if (!user) {
      throw new NotFoundException('User not found.')
    }

    return user
  }
}
