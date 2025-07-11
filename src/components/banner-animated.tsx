"use client"

import Image from "next/image"
import AnimatedContent from "./AnimatedContent/AnimatedContent"
import { Card, CardContent } from "./ui/card"

const BannerAnimated = () => {
  return (
    <Card className="mt-5 bg-primary-foreground md:hidden">
      <CardContent className="px-6 py-4">
        <AnimatedContent
          distance={200}
          direction="horizontal"
          reverse={false}
          duration={1}
          ease="power3.out"
          initialOpacity={0.2}
          animateOpacity
          scale={1}
          threshold={0.1}
          delay={0}
        >
          <div className="flex items-center justify-between">
            <div className="text-center text-xs">
              <h3 className="text-2xl font-bold">Venha descobrir</h3>
              <p>nossos planos de assinatura.</p>
              <p>Esperamos por você!</p>
            </div>
            <div className="relative h-28 w-28">
              <Image src="/dandys-den.png" alt="Dandys Den" fill />
            </div>
          </div>
        </AnimatedContent>
      </CardContent>
    </Card>
  )
}

export default BannerAnimated
