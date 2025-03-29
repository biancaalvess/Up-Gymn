"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowRight, Check, ChevronDown, Clock, Dumbbell, Facebook, Instagram, MapPin, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { registerUser } from "@/app/actions"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationNumber, setRegistrationNumber] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const plan = formData.get("plan") as string

    try {
      const result = await registerUser({ name, email, phone, plan })

      if (result.success) {
        setRegistrationNumber(result.registrationNumber)
        toast({
          title: "Cadastro realizado com sucesso!",
          description: `Seu número de cadastro é: ${result.registrationNumber}`,
          variant: "default",
        })
        // Reset form
        event.currentTarget.reset()
      } else {
        toast({
          title: "Erro ao cadastrar",
          description: result.error || "Ocorreu um erro ao processar seu cadastro. Tente novamente.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao cadastrar",
        description: "Ocorreu um erro ao processar seu cadastro. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan || null)
    setIsDialogOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled ? "bg-black/90 backdrop-blur-md py-2" : "bg-transparent py-4"}`}
      >
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl text-yellow-400">
            <Dumbbell className="h-6 w-6" />
            <span>UP GYMN</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors"
            >
              ESTRUTURA
            </Link>
            <Link
              href="#services"
              className="text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors"
            >
              SERVIÇOS
            </Link>
            <Link href="#plans" className="text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors">
              PLANOS
            </Link>
            <Link href="#hours" className="text-sm font-medium text-gray-300 hover:text-yellow-400 transition-colors">
              HORÁRIOS
            </Link>
          </nav>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="hidden md:flex bg-red-600 hover:bg-red-700 text-white">CADASTRAR</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800">
              <DialogHeader>
                <DialogTitle>Cadastre-se na UP GYMN</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Preencha seus dados para começar sua jornada fitness conosco.
                </DialogDescription>
              </DialogHeader>
              {registrationNumber ? (
                <div className="py-6">
                  <Alert className="bg-green-900/30 border-green-800">
                    <AlertTitle className="text-green-400">Cadastro realizado com sucesso!</AlertTitle>
                    <AlertDescription className="mt-2">
                      <p className="mb-2">Seu número de cadastro é:</p>
                      <p className="text-2xl font-bold text-yellow-400">{registrationNumber}</p>
                      <p className="mt-4 text-sm text-gray-400">
                        Guarde este número para acessar a academia e para futuras referências.
                      </p>
                    </AlertDescription>
                  </Alert>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => setRegistrationNumber(null)} className="bg-red-600 hover:bg-red-700">
                      Novo Cadastro
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" name="name" className="bg-gray-800 border-gray-700" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" className="bg-gray-800 border-gray-700" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" name="phone" type="tel" className="bg-gray-800 border-gray-700" required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="plan">Plano</Label>
                      <Select name="plan" required>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Selecione um plano" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="basic">Plano Básico - R$ 89,90</SelectItem>
                          <SelectItem value="premium">Plano Premium - R$ 129,90</SelectItem>
                          <SelectItem value="elite">Plano Elite - R$ 199,90</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                      {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                    </Button>
                  </DialogFooter>
                </form>
              )}
              <div className="mt-4 text-center">
                <Link
                  href="https://wa.me/5500000000000?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20UP%20GYMN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-yellow-400 hover:underline"
                >
                  Prefere conversar pelo WhatsApp? Clique aqui
                </Link>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden border-gray-700 text-white">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800">
              <DialogHeader>
                <DialogTitle>Menu</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <Link href="#features" className="text-lg font-medium hover:text-yellow-400 transition-colors">
                  Estrutura
                </Link>
                <Link href="#services" className="text-lg font-medium hover:text-yellow-400 transition-colors">
                  Serviços
                </Link>
                <Link href="#plans" className="text-lg font-medium hover:text-yellow-400 transition-colors">
                  Planos
                </Link>
                <Link href="#hours" className="text-lg font-medium hover:text-yellow-400 transition-colors">
                  Horários
                </Link>
                <Button className="bg-red-600 hover:bg-red-700">Cadastrar</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div> 
      </header>
      <main className="flex-1 pt-16">
        <section className="relative h-screen flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-9" />
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/video.mp4" type="video/mp4" />
            Seu navegador não suporta o vídeo.
          </video>
          <div className="container relative z-20 flex flex-col items-start justify-center h-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                TRANSFORME SEU <span className="text-yellow-400">CORPO</span> E SUA{" "}
                <span className="text-red-500">MENTE</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-xl">
                Treine na academia física mais completa da cidade com equipamentos de última geração e profissionais
                qualificados.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg">
                  COMECE AGORA
                </Button>
                <Link href="#plans">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10 px-8 py-6 text-lg"
                  >
                    VER PLANOS
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
            <Link href="#features">
              <ChevronDown className="h-10 w-10 text-white" />
            </Link>
          </div>
        </section>

        <section id="features" className="py-24 bg-gradient-to-b from-black to-gray-900">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                ESTRUTURA <span className="text-yellow-400">PREMIUM</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Oferecemos o melhor ambiente para seus treinos com equipamentos modernos e instalações completas.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group">
                <div className="overflow-hidden rounded-xl mb-4">
                  <Image
                    src="https://i.pinimg.com/736x/45/e8/68/45e8689d52e356802a33d55fa2253c9c.jpg"
                    alt="Banheiros"
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-yellow-400">Banheiros Completos</h3>
                <p className="text-gray-400">
                  Banheiros espaçosos com chuveiros, armários e secadores de cabelo para seu conforto.
                </p>
              </div>
              <div className="group">
                <div className="overflow-hidden rounded-xl mb-4">
                  <Image
                    src="https://i.pinimg.com/736x/52/5d/81/525d8189cf85fcbeed88cf33c13a6b37.jpg"
                    alt="Armários"
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-yellow-400">Armários Individuais</h3>
                <p className="text-gray-400">
                  Armários seguros com chave ou senha para guardar seus pertences durante o treino.
                </p>
              </div>
              <div className="group">
                <div className="overflow-hidden rounded-xl mb-4">
                  <Image
                    src="https://i.pinimg.com/736x/2c/43/80/2c4380d3e474d261f0c032408f171472.jpg"
                    alt="Ar Condicionado"
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-yellow-400">Ambiente Climatizado</h3>
                <p className="text-gray-400">
                  Ambiente climatizado para seu conforto durante os exercícios em qualquer estação do ano.
                </p>
              </div>
              <div className="group">
                <div className="overflow-hidden rounded-xl mb-4">
                  <Image
                    src="https://i.pinimg.com/736x/de/8f/57/de8f579651b2e0a6cddbd359182f95ad.jpg"
                    alt="Equipamentos"
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 text-yellow-400">Equipamentos Modernos</h3>
                <p className="text-gray-400">
                  Aparelhos de última geração para todos os grupos musculares e objetivos de treino.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-24 bg-gray-900">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                NOSSOS <span className="text-red-500">SERVIÇOS</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Oferecemos serviços especializados para potencializar seus resultados.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-800/80 transition-colors">
                <div className="bg-red-600 p-4 rounded-full text-white inline-block mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M18 20a6 6 0 0 0-12 0"></path>
                    <circle cx="12" cy="10" r="4"></circle>
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Nutricionista</h3>
                <p className="text-gray-400 mb-6">
                  Acompanhamento nutricional personalizado para otimizar seus resultados e melhorar sua saúde. Nossos
                  nutricionistas criam planos alimentares adaptados às suas necessidades.
                </p>
                <Link href="#plans" className="text-yellow-400 flex items-center gap-2 group">
                  Saiba mais <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-800/80 transition-colors">
                <div className="bg-red-600 p-4 rounded-full text-white inline-block mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"></path>
                    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"></path>
                    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Balé</h3>
                <p className="text-gray-400 mb-6">
                  Aulas de balé para melhorar postura, flexibilidade e coordenação motora. Ideal para todas as idades e
                  níveis de experiência, com professores especializados.
                </p>
                <Link href="#plans" className="text-yellow-400 flex items-center gap-2 group">
                  Saiba mais <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-800/80 transition-colors">
                <div className="bg-red-600 p-4 rounded-full text-white inline-block mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <path d="M14 4.5 9.5 9 7 6.5 3.5 10 6 12.5 2 16.5 5.5 20 10 15.5l-2.5-2.5L11 9.5l4.5-4.5"></path>
                    <path d="M5 6.5 7 4.5 17.5 15l-2 2"></path>
                    <path d="M20 13.5 22 16l-2.5 2.5-2-2"></path>
                    <path d="M10.5 20a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1Z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Fisioterapeuta</h3>
                <p className="text-gray-400 mb-6">
                  Atendimento fisioterapêutico para prevenção e tratamento de lesões. Nossa equipe de fisioterapeutas
                  trabalha para garantir sua recuperação e bem-estar físico.
                </p>
                <Link href="#plans" className="text-yellow-400 flex items-center gap-2 group">
                  Saiba mais <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="bg-gray-800 p-8 rounded-xl hover:bg-gray-800/80 transition-colors">
                <div className="bg-red-600 p-4 rounded-full text-white inline-block mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a4.2 4.2 0 0 0 4 4 4.2 4.2 0 0 1 3 2 4.2 4.2 0 0 1-1 5 4.2 4.2 0 0 0-2 4 4.2 4.2 0 0 1-4 3 4.2 4.2 0 0 1-4-3 4.2 4.2 0 0 0-2-4 4.2 4.2 0 0 1-1-5 4.2 4.2 0 0 1 3-2 4.2 4.2 0 0 0 4-4"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Personal Trainer</h3>
                <p className="text-gray-400 mb-6">
                  Treinamento personalizado para atingir seus objetivos de forma eficiente e segura. Nossos personal
                  trainers são qualificados para desenvolver o melhor programa para você.
                </p>
                <Link href="#plans" className="text-yellow-400 flex items-center gap-2 group">
                  Saiba mais <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="plans" className="py-24 bg-black relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 to-black/80 z-0" />
          <div className="container relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                ESCOLHA SEU <span className="text-yellow-400">PLANO</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Temos o plano perfeito para você alcançar seus objetivos.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all hover:translate-y-[-8px] duration-300">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Plano Básico</CardTitle>
                  <CardDescription className="text-gray-400">Para iniciantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold mb-6 text-yellow-400">
                    R$ 89,90<span className="text-sm font-normal text-gray-400">/mês</span>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-red-500" />
                      <span>Acesso à musculação</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-red-500" />
                      <span>Horário comercial</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-red-500" />
                      <span>Armário compartilhado</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <X className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-500">Aulas coletivas</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <X className="h-5 w-5 text-gray-600" />
                      <span className="text-gray-500">Serviços especializados</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-red-600 hover:bg-red-700 py-6" onClick={() => handlePlanSelect("basic")}>
                    ESCOLHER PLANO
                  </Button>
                </CardFooter>
              </Card>
              <Card className="bg-red-600 border-red-500 relative overflow-hidden hover:translate-y-[-8px] transition-all duration-300">
                <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-1 text-sm font-bold">
                  POPULAR
                </div>
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Plano Premium</CardTitle>
                  <CardDescription className="text-red-200">Para entusiastas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold mb-6 text-white">
                    R$ 129,90<span className="text-sm font-normal text-red-200">/mês</span>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-yellow-400" />
                      <span>Acesso à musculação</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-yellow-400" />
                      <span>Acesso 24 horas</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-yellow-400" />
                      <span>Armário individual</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-yellow-400" />
                      <span>Aulas coletivas</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <X className="h-5 w-5 text-red-300" />
                      <span className="text-red-200">Serviços especializados</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-6"
                    onClick={() => handlePlanSelect("premium")}
                  >
                    ESCOLHER PLANO
                  </Button>
                </CardFooter>
              </Card>
              <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-all hover:translate-y-[-8px] duration-300">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">Plano Elite</CardTitle>
                  <CardDescription className="text-gray-400">Para profissionais</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-bold mb-6 text-yellow-400">
                    R$ 199,90<span className="text-sm font-normal text-gray-400">/mês</span>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-red-500" />
                      <span>Acesso à musculação</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-red-500" />
                      <span>Acesso 24 horas</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-red-500" />
                      <span>Armário individual premium</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-red-500" />
                      <span>Todas as aulas coletivas</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-red-500" />
                      <span>Serviços especializados inclusos</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-red-600 hover:bg-red-700 py-6" onClick={() => handlePlanSelect("elite")}>
                    ESCOLHER PLANO
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section id="hours" className="py-24 bg-gradient-to-b from-gray-900 to-black">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                HORÁRIO DE <span className="text-red-500">FUNCIONAMENTO</span>
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Estamos abertos todos os dias para atender você no seu melhor horário.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <Tabs defaultValue="weekdays" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                  <TabsTrigger value="weekdays" className="data-[state=active]:bg-red-600">
                    Segunda a Sexta
                  </TabsTrigger>
                  <TabsTrigger value="weekend" className="data-[state=active]:bg-red-600">
                    Sábado e Domingo
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="weekdays" className="p-8 border border-gray-800 rounded-md mt-4 bg-gray-900">
                  <div className="flex items-center gap-6 mb-6">
                    <Clock className="h-10 w-10 text-yellow-400" />
                    <div>
                      <h3 className="font-bold text-xl mb-1">Musculação</h3>
                      <p className="text-gray-400 text-lg">06:00 - 23:00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mb-6">
                    <Clock className="h-10 w-10 text-yellow-400" />
                    <div>
                      <h3 className="font-bold text-xl mb-1">Aulas Coletivas</h3>
                      <p className="text-gray-400 text-lg">07:00 - 21:00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <Clock className="h-10 w-10 text-yellow-400" />
                    <div>
                      <h3 className="font-bold text-xl mb-1">Serviços Especializados</h3>
                      <p className="text-gray-400 text-lg">08:00 - 20:00</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="weekend" className="p-8 border border-gray-800 rounded-md mt-4 bg-gray-900">
                  <div className="flex items-center gap-6 mb-6">
                    <Clock className="h-10 w-10 text-yellow-400" />
                    <div>
                      <h3 className="font-bold text-xl mb-1">Musculação</h3>
                      <p className="text-gray-400 text-lg">08:00 - 20:00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mb-6">
                    <Clock className="h-10 w-10 text-yellow-400" />
                    <div>
                      <h3 className="font-bold text-xl mb-1">Aulas Coletivas</h3>
                      <p className="text-gray-400 text-lg">09:00 - 18:00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <Clock className="h-10 w-10 text-yellow-400" />
                    <div>
                      <h3 className="font-bold text-xl mb-1">Serviços Especializados</h3>
                      <p className="text-gray-400 text-lg">10:00 - 16:00</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        <section className="py-24 bg-red-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-600 z-0" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-400 via-transparent to-transparent"></div>
          </div>
          <div className="container relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  TRANSFORME SEU CORPO E SUA VIDA <span className="text-yellow-400">HOJE MESMO</span>
                </h2>
                <p className="text-xl mb-8 text-red-100">
                  Junte-se a milhares de pessoas que já transformaram suas vidas na UP GYMN. O primeiro passo para uma
                  vida mais saudável começa aqui.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-6 text-lg">
                        CADASTRE-SE AGORA
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white border-gray-800">
                      <DialogHeader>
                        <DialogTitle>Cadastre-se na UP GYMN</DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Preencha seus dados para começar sua jornada fitness conosco.
                        </DialogDescription>
                      </DialogHeader>
                      {registrationNumber ? (
                        <div className="py-6">
                          <Alert className="bg-green-900/30 border-green-800">
                            <AlertTitle className="text-green-400">Cadastro realizado com sucesso!</AlertTitle>
                            <AlertDescription className="mt-2">
                              <p className="mb-2">Seu número de cadastro é:</p>
                              <p className="text-2xl font-bold text-yellow-400">{registrationNumber}</p>
                              <p className="mt-4 text-sm text-gray-400">
                                Guarde este número para acessar a academia e para futuras referências.
                              </p>
                            </AlertDescription>
                          </Alert>
                          <div className="mt-6 flex justify-end">
                            <Button onClick={() => setRegistrationNumber(null)} className="bg-red-600 hover:bg-red-700">
                              Novo Cadastro
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit}>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="name-modal">Nome</Label>
                              <Input id="name-modal" name="name" className="bg-gray-800 border-gray-700" required />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="email-modal">Email</Label>
                              <Input
                                id="email-modal"
                                name="email"
                                type="email"
                                className="bg-gray-800 border-gray-700"
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="phone-modal">Telefone</Label>
                              <Input
                                id="phone-modal"
                                name="phone"
                                type="tel"
                                className="bg-gray-800 border-gray-700"
                                required
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="plan-modal">Plano</Label>
                              <Select name="plan" defaultValue={selectedPlan || ""} required>
                                <SelectTrigger id="plan-modal" className="bg-gray-800 border-gray-700">
                                  <SelectValue placeholder="Selecione um plano" />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                  <SelectItem value="basic">Plano Básico - R$ 89,90</SelectItem>
                                  <SelectItem value="premium">Plano Premium - R$ 129,90</SelectItem>
                                  <SelectItem value="elite">Plano Elite - R$ 199,90</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="submit"
                              className="w-full bg-red-600 hover:bg-red-700"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                            </Button>
                          </DialogFooter>
                        </form>
                      )}
                      <div className="mt-4 text-center">
                        <Link
                          href="https://wa.me/5500000000000?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20UP%20GYMN"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-yellow-400 hover:underline"
                        >
                          Prefere conversar pelo WhatsApp? Clique aqui
                        </Link>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Link
                    href="https://wa.me/5500000000000?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20UP%20GYMN"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/20 px-8 py-6 text-lg"
                    >
                      FALE PELO WHATSAPP
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="w-full max-w-md">
                <Image
                  src="https://i.pinimg.com/736x/15/43/7f/15437f6be04ed55e7d324812cdb28e78.jpg"
                  alt="Pessoa treinando"
                  width={400}
                  height={500}
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-black text-white py-16 border-t border-gray-800">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-2 font-bold text-2xl text-yellow-400 mb-6">
                <Dumbbell className="h-6 w-6" />
                <span>UP GYMN</span>
              </div>
              <p className="text-gray-400 mb-6">Transformando vidas através do fitness desde 2023.</p>
              <div className="flex items-center gap-4">
                <Link href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link href="#" className="bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Links Rápidos</h3>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <Link href="#features" className="hover:text-yellow-400 transition-colors">
                    Estrutura
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="hover:text-yellow-400 transition-colors">
                    Serviços
                  </Link>
                </li>
                <li>
                  <Link href="#plans" className="hover:text-yellow-400 transition-colors">
                    Planos
                  </Link>
                </li>
                <li>
                  <Link href="#hours" className="hover:text-yellow-400 transition-colors">
                    Horários
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Contato</h3>
              <div className="space-y-4 text-gray-400">
                <p>contato@upgymn.com</p>
                <p>(00) 0000-0000</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-6">Endereço</h3>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                <p>
                  Av. Exemplo, 1234 - Centro
                  <br />
                  Cidade - Estado
                  <br />
                  CEP: 00000-000
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} UP GYMN. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

