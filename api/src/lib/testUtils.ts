import prisma from '../prisma'

export async function createMock() {
  const user = await prisma.user.create({
    data: {
      firstname: 'Test',
      lastname: 'User',
      email: 'log@codeanker.de',
      password: '123',
      role: 'ADMIN',
    },
  })
  return { user }
}

export async function cleanup() {
  await prisma.user.deleteMany({
    where: {
      email: 'log@codeanker.de',
    },
  })
}

// export async function clientCreate() {
// const client = await prisma.zw_client.create({
//   data: {
//     id: await createId(),
//     name: options.input.name,
//     url: options.input.name,
//   },
// })

// const userAdminRole = await prisma.zw_user_role.create({
//   data: {
//     id: await createId(),
//     bezeichnung: 'Admin',
//     fk_client: client.id,
//     mittellohn: false,
//   },
// })

// await prisma.zw_client_konfiguration.create({
//   data: {
//     id: await createId(),
//     fk_client: client.id,
//   },
// })

// const user = await prisma.zw_user_account.create({
//   data: {
//     id: await createId(),
//     username: 'admin',
//     password: 'b58558d04227aef195c7aae484f029f1bb51f3f7',
//     cleartext_password: 'arosa2022',
//     fk_client: client.id,
//     fk_user_role: userAdminRole.id,
//   },
// })

//   return {
//     // client,
//     // user,
//   }
// }
