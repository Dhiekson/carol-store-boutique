
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    toast({
      title: "Mensagem enviada!",
      description: "Agradecemos seu contato. Responderemos o mais breve possível.",
    });
    
    // Reset form fields
    e.currentTarget.reset();
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-playfair text-4xl font-bold mb-2">Entre em <span className="text-carol-red">Contato</span></h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estamos aqui para responder suas dúvidas e ouvir suas sugestões. 
              Entre em contato conosco através dos canais abaixo.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div>
              <h2 className="font-playfair text-2xl font-bold mb-6">Envie uma mensagem</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Nome</label>
                    <Input id="name" placeholder="Seu nome" required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="seu@email.com" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Assunto</label>
                  <Input id="subject" placeholder="Assunto da mensagem" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Mensagem</label>
                  <Textarea 
                    id="message" 
                    placeholder="Como podemos ajudar?" 
                    className="min-h-32 resize-none"
                    required
                  />
                </div>
                
                <Button type="submit" className="bg-carol-red hover:bg-carol-red/90 btn-hover">
                  Enviar Mensagem
                </Button>
              </form>
            </div>
            
            <div className="lg:pl-10">
              <h2 className="font-playfair text-2xl font-bold mb-6">Informações de Contato</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="p-3 bg-carol-red/10 rounded-full mr-4">
                    <MapPin className="h-5 w-5 text-carol-red" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Endereço</h3>
                    <p className="text-muted-foreground">
                      Av. Rondon Pacheco, 123<br />
                      Uberlândia, MG - 38400-000
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-3 bg-carol-red/10 rounded-full mr-4">
                    <Phone className="h-5 w-5 text-carol-red" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Telefone</h3>
                    <p className="text-muted-foreground">(34) 9999-9999</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-3 bg-carol-red/10 rounded-full mr-4">
                    <Mail className="h-5 w-5 text-carol-red" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-muted-foreground">contato@carolstoreudi.com</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium mb-3">Horário de Funcionamento</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex justify-between">
                    <span>Segunda - Sexta:</span>
                    <span>09:00 - 19:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sábado:</span>
                    <span>09:00 - 17:00</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Domingo:</span>
                    <span>Fechado</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8 aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.53551746371!2d-48.28341182392517!3d-18.91807015970986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94a44579500f589d%3A0x5e9fbdb883d1a802!2sAv.%20Rondon%20Pacheco%20-%20Uberl%C3%A2ndia%2C%20MG!5e0!3m2!1sen!2sbr!4v1687871254476!5m2!1sen!2sbr"
                  width="100%" 
                  height="300" 
                  className="border-0 rounded-lg"
                  loading="lazy"
                  title="CarolStoreUdi location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
