// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const housesSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    name: Type.String(),
    //@ToDo Type in Enum umbauen Types = Zelt oder Haus
    type: Type.String(),
    description: Type.Optional(Type.String())
  },
  { $id: 'Houses', additionalProperties: false }
)
export type Houses = Static<typeof housesSchema>
export const housesValidator = getValidator(housesSchema, dataValidator)
export const housesResolver = resolve<Houses, HookContext>({})

export const housesExternalResolver = resolve<Houses, HookContext>({})

// Schema for creating new entries
export const housesDataSchema = Type.Pick(housesSchema, ['name', 'type'], {
  $id: 'HousesData'
})
export type HousesData = Static<typeof housesDataSchema>
export const housesDataValidator = getValidator(housesDataSchema, dataValidator)
export const housesDataResolver = resolve<Houses, HookContext>({})

// Schema for updating existing entries
export const housesPatchSchema = Type.Partial(housesSchema, {
  $id: 'HousesPatch'
})
export type HousesPatch = Static<typeof housesPatchSchema>
export const housesPatchValidator = getValidator(housesPatchSchema, dataValidator)
export const housesPatchResolver = resolve<Houses, HookContext>({})

// Schema for allowed query properties
export const housesQueryProperties = Type.Pick(housesSchema, ['_id', 'name', 'type'])
export const housesQuerySchema = Type.Intersect(
  [
    querySyntax(housesQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type HousesQuery = Static<typeof housesQuerySchema>
export const housesQueryValidator = getValidator(housesQuerySchema, queryValidator)
export const housesQueryResolver = resolve<HousesQuery, HookContext>({})
