"use server"

import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"

type UserData = {
  name: string
  email: string
  phone: string
  plan: string
}

export async function registerUser(data: UserData) {
  const { name, email, phone, plan } = data

  // Validação básica
  if (!name || !email || !phone || !plan) {
    return {
      success: false,
      error: "Todos os campos são obrigatórios",
    }
  }

  try {
    // Verificar se o email já existe
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email}
    `.catch(() => ({ rows: [] }))

    if (existingUser.rows?.length > 0) {
      return {
        success: false,
        error: "Este email já está cadastrado",
      }
    }

    // Gerar número de cadastro único
    // Formato: UP + ano atual + 4 dígitos aleatórios
    const year = new Date().getFullYear().toString().slice(2)
    const randomDigits = Math.floor(1000 + Math.random() * 9000)
    const registrationNumber = `UP${year}${randomDigits}`

    // Criar tabela se não existir
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        plan VARCHAR(50) NOT NULL,
        registration_number VARCHAR(10) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Inserir novo usuário
    await sql`
      INSERT INTO users (name, email, phone, plan, registration_number)
      VALUES (${name}, ${email}, ${phone}, ${plan}, ${registrationNumber})
    `

    revalidatePath("/")

    return {
      success: true,
      registrationNumber,
    }
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error)
    return {
      success: false,
      error: "Erro ao processar o cadastro. Tente novamente.",
    }
  }
}


