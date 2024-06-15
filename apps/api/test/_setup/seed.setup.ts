import { faker } from '@faker-js/faker'
import { testConstants } from '../_utils/constants.utils'

/*
 * Seed the faker library with a constant seed for deterministic tests
 */
export const setupSeed = () => {
  faker.seed(testConstants.SEED)
}
