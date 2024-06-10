import { z } from 'zod'

const genderTypes = ['Masculino', 'Feminino', 'Prefiro não responder'] as const
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const

export const userSchema = z.object({
  nome: z
    .string()
    .min(2, {
      message: 'O nome deve ter no mínimo 2 caracteres.',
    })
    .max(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
    .transform((name) => {
      return name
        .trim()
        .split(' ')
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1))
        })
        .join(' ')
    }),
  genero: z.enum(genderTypes, {
    errorMap: () => ({ message: 'Selecione uma opção de gênero.' }),
  }),
  tipoSanguineo: z.enum(bloodTypes, {
    errorMap: () => ({ message: 'Selecione uma opção de tipo sanguíneo.' }),
  }),
  termosAceitos: z.literal(true, {
    errorMap: () => ({ message: 'Você deve aceitar os termos.' }),
  }),
  dataConsulta: z.coerce
    .date({
      errorMap: () => ({ message: 'Selecione uma data depois de hoje.' }),
    })
    .refine((data) => data > new Date(), {
      message: 'Selecione uma data depois de hoje.',
    })
    .transform((data) => data.toISOString().split('T')[0]),
})

export type User = z.infer<typeof userSchema>

export const users: User[] = []
