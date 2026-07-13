'use client';

import { FormEvent, useMemo, useState } from 'react';

type Step = 'welcome' | 'profile' | 'home' | 'priorities' | 'saving' | 'complete';
type Profile = 'resident' | 'integrator';

type OnboardingSession = {
  id: string;
  home: { id: string; name: string; priorities: string[]; healthStatus: string };
  nextStep: string;
};

const priorities = [
  { id: 'comfort', label: 'Conforto', icon: '◉' },
  { id: 'security', label: 'Segurança', icon: '◇' },
  { id: 'energy', label: 'Energia', icon: 'ϟ' },
  { id: 'automation', label: 'Automação', icon: '✦' },
];

export default function GenesisPage() {
  const [step, setStep] = useState<Step>('welcome');
  const [profile, setProfile] = useState<Profile>('resident');
  const [homeName, setHomeName] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(['comfort', 'security']);
  const [session, setSession] = useState<OnboardingSession | null>(null);
  const [error, setError] = useState('');

  const progress = useMemo(() => {
    const order: Step[] = ['welcome', 'profile', 'home', 'priorities', 'saving', 'complete'];
    return ((order.indexOf(step) + 1) / order.length) * 100;
  }, [step]);

  function submitHome(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (homeName.trim()) setStep('priorities');
  }

  function togglePriority(id: string) {
    setSelectedPriorities((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  async function createExperience() {
    setError('');
    setStep('saving');

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, homeName, priorities: selectedPriorities }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result?.error?.message ?? 'Não foi possível concluir a configuração.');
      setSession(result.data);
      setStep('complete');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Ocorreu um erro inesperado.');
      setStep('priorities');
    }
  }

  return (
    <main className="genesis-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="topbar">
        <div className="brand"><div className="brand-mark">H</div><div><strong>HYBRID</strong><span>HOME ASSISTANT</span></div></div>
        <div className="genesis-badge">GENESIS · PREVIEW</div>
      </header>

      <section className="experience-card">
        <div className="progress-track" aria-label="Progresso da configuração"><span style={{ width: `${progress}%` }} /></div>
        <aside className="ai-presence">
          <div className="orb-wrap"><div className="orb-core">✦</div><span className="orb-ring ring-one" /><span className="orb-ring ring-two" /></div>
          <div className="ai-status"><i /> HYBRID AI online</div>
          <p>Configuração segura, local e orientada por inteligência.</p>
        </aside>

        <div className="content-panel">
          {step === 'welcome' && <div className="step enter"><span className="eyebrow">BEM-VINDO AO GENESIS</span><h1>Sua casa inteligente começa aqui.</h1><p className="lead">Olá. Eu sou a HYBRID AI e vou criar com você uma experiência residencial inteligente, elegante e personalizada.</p><div className="actions"><button className="primary" onClick={() => setStep('profile')}>Começar configuração <b>→</b></button><button className="secondary">Explorar demonstração</button></div><div className="trust-row"><span>● Local First</span><span>● Privacidade por padrão</span><span>● Configuração assistida</span></div></div>}

          {step === 'profile' && <div className="step enter"><span className="eyebrow">PERFIL DE EXPERIÊNCIA</span><h2>Como você usará o HHA?</h2><p className="lead small">A interface se adapta ao seu nível de experiência sem limitar o poder da plataforma.</p><div className="choice-grid"><button className={`choice ${profile === 'resident' ? 'selected' : ''}`} onClick={() => setProfile('resident')}><span className="choice-icon">⌂</span><strong>Morador</strong><small>Experiência guiada, simples e inteligente.</small></button><button className={`choice ${profile === 'integrator' ? 'selected' : ''}`} onClick={() => setProfile('integrator')}><span className="choice-icon">⌘</span><strong>Integrador</strong><small>Diagnósticos, protocolos e controles avançados.</small></button></div><div className="actions"><button className="primary" onClick={() => setStep('home')}>Continuar <b>→</b></button></div></div>}

          {step === 'home' && <form className="step enter" onSubmit={submitHome}><span className="eyebrow">SUA RESIDÊNCIA</span><h2>Como vamos chamar sua casa?</h2><p className="lead small">Este nome aparecerá no dashboard, nos comandos de voz e nas sugestões da HYBRID AI.</p><label className="field"><span>Nome da residência</span><input autoFocus value={homeName} onChange={(event) => setHomeName(event.target.value)} placeholder="Ex.: Casa da Família Silva" /></label><div className="suggestions"><button type="button" onClick={() => setHomeName('Casa Principal')}>Casa Principal</button><button type="button" onClick={() => setHomeName('Meu Lar')}>Meu Lar</button></div><div className="actions"><button className="primary" disabled={!homeName.trim()}>Continuar <b>→</b></button></div></form>}

          {step === 'priorities' && <div className="step enter"><span className="eyebrow">HOME DNA</span><h2>O que mais importa para você?</h2><p className="lead small">Usarei essas prioridades para montar o primeiro dashboard e sugerir automações relevantes.</p><div className="priority-grid">{priorities.map((item) => <button key={item.id} className={`priority ${selectedPriorities.includes(item.id) ? 'selected' : ''}`} onClick={() => togglePriority(item.id)}><span>{item.icon}</span><strong>{item.label}</strong></button>)}</div>{error && <p className="form-error" role="alert">{error}</p>}<div className="actions"><button className="primary" onClick={createExperience}>Criar minha experiência <b>→</b></button></div></div>}

          {step === 'saving' && <div className="step complete enter"><div className="orb-core saving-orb">✦</div><span className="eyebrow">HYBRID AI</span><h2>Preparando sua experiência.</h2><p className="lead small">Estou criando o Home DNA inicial e preparando a próxima etapa do Genesis.</p></div>}

          {step === 'complete' && <div className="step complete enter"><div className="success-mark">✓</div><span className="eyebrow">PRIMEIRA ETAPA CONCLUÍDA</span><h2>{session?.home.name ?? homeName} começou a ganhar inteligência.</h2><p className="lead small">O Genesis salvou seu perfil inicial. O próximo passo será descobrir dispositivos e criar seus ambientes automaticamente.</p><div className="summary-grid"><article><small>Perfil</small><strong>{profile === 'resident' ? 'Morador' : 'Integrador'}</strong></article><article><small>Prioridades</small><strong>{session?.home.priorities.length ?? selectedPriorities.length}</strong></article><article><small>House Health</small><strong>Preparando…</strong></article></div><div className="actions"><button className="primary">Descobrir dispositivos <b>→</b></button><button className="secondary" onClick={() => { setSession(null); setStep('welcome'); }}>Reiniciar preview</button></div></div>}
        </div>
      </section>
      <footer><span>HYBRID Home Assistant · Genesis</span><span>Premium from Day One</span></footer>
    </main>
  );
}
