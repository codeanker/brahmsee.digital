// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import { ObjectIdSchema } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'

// Main data model schema
export const roomsSchema = Type.Object(
  {
    _id: ObjectIdSchema(),
    name: Type.String(),
    description: Type.Optional(Type.String()),
    number: Type.String(),
    capacity: Type.String(),
  },
  { $id: 'Rooms', additionalProperties: false }
)
export type Rooms = Static<typeof roomsSchema>
export const roomsValidator = getValidator(roomsSchema, dataValidator)
export const roomsResolver = resolve<Rooms, HookContext>({})

export const roomsExternalResolver = resolve<Rooms, HookContext>({})

// Schema for creating new entries
export const roomsDataSchema = Type.Pick(roomsSchema, ['name', 'description', 'capacity', 'number'], {
  $id: 'RoomsData'
})
export type RoomsData = Static<typeof roomsDataSchema>
export const roomsDataValidator = getValidator(roomsDataSchema, dataValidator)
export const roomsDataResolver = resolve<Rooms, HookContext>({})

// Schema for updating existing entries
export const roomsPatchSchema = Type.Partial(roomsSchema, {
  $id: 'RoomsPatch'
})
export type RoomsPatch = Static<typeof roomsPatchSchema>
export const roomsPatchValidator = getValidator(roomsPatchSchema, dataValidator)
export const roomsPatchResolver = resolve<Rooms, HookContext>({})

// Schema for allowed query properties
export const roomsQueryProperties = Type.Pick(roomsSchema, ['_id', 'name', 'description', 'capacity', 'number'])
export const roomsQuerySchema = Type.Intersect(
  [
    querySyntax(roomsQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type RoomsQuery = Static<typeof roomsQuerySchema>
export const roomsQueryValidator = getValidator(roomsQuerySchema, queryValidator)
export const roomsQueryResolver = resolve<RoomsQuery, HookContext>({})
