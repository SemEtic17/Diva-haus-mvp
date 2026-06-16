import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Camera, Search, UserCheck } from 'lucide-react';

const ValueProp = () => {
  const { t } = useTranslation();

  const steps = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: t('landing.step1_title', 'Upload Your Best Shot'),
      desc: t('landing.step1_desc', 'Upload a clear, full-body photo of yourself to get started.'),
      color: 'neon-cyan'
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: t('landing.step2_title', 'Curate Your Look'),
      desc: t('landing.step2_desc', 'Browse our exclusive collection of high-end boutique pieces.'),
      color: 'gold'
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: t('landing.step3_title', 'See the Transformation'),
      desc: t('landing.step3_desc', 'Our AI instantly generates a realistic preview of you in the outfit.'),
      color: 'neon-pink'
    }
  ];

  return (
    <section className="py-24 bg-card/10 backdrop-blur-sm border-y border-glass-border/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-gold text-xs font-bold uppercase tracking-[0.4em] block mb-4"
          >
            {t('landing.experience_eyebrow', 'The Experience')}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-serif font-bold text-foreground"
          >
            {t('landing.experience_title', 'How Virtual Try-On Works')}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="flex flex-col items-center text-center group"
            >
              <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 
                              bg-background border border-glass-border/30 
                              shadow-luxury group-hover:shadow-luxury-hover transition-all duration-500
                              relative overflow-hidden`}
              >
                {/* Accent glow */}
                <div className={`absolute inset-0 bg-${step.color}/5 opacity-0 group-hover:opacity-100 transition-opacity`} />
                
                <div className={`text-${step.color} group-hover:scale-110 transition-transform duration-500`}>
                  {step.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[250px]">
                {step.desc}
              </p>
              
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 left-[calc(100%-2rem)] w-16 h-px bg-gradient-to-r from-glass-border to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProp;
