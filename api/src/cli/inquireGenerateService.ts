import inquirer from 'inquirer'

import { generateService } from './generator/generateService.js'

export async function inquireGenerateService(missingServices, context) {
  const prismOrCustomAnswer = (await inquirer.prompt([
    {
      type: 'list',
      name: 'serviceType',
      message: 'Which service do you want to generate?',
      choices: ['prisma', 'custom'],
    },
  ])) as { serviceType: 'prisma' | 'custom' }

  if (prismOrCustomAnswer.serviceType === 'prisma') {
    if (missingServices.length === 0) {
      console.log('No services to create')
      process.exit(0)
    }
    const servicedToCreateAnswer = (await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'services',
        message: 'Which services do you want to generate?',
        choices: missingServices,
      },
    ])) as { services: string[] }
    for (const service of servicedToCreateAnswer.services) {
      await generateService(service, context)
    }
  } else {
    const customServiceAnswer = (await inquirer.prompt([
      {
        type: 'input',
        name: 'serviceName',
        message: 'What is the name of the service?',
      },
    ])) as { serviceName: string }
    await generateService(customServiceAnswer.serviceName, context)
  }
}
