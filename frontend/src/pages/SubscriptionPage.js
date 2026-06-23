import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { subscriptionAPI } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { useSiteSettings } from "../contexts/SiteSettingsContext";
import { Crown, Check } from "lucide-react";
import PaymentButton from "../components/PaymentButton";

export default function SubscriptionPage() {
  const { user } = useAuth();
  const { settings } = useSiteSettings();
  const [plans, setPlans] = useState([]);
  const [mySub, setMySub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      subscriptionAPI.plans(),
      user ? subscriptionAPI.mySubscription() : Promise.resolve({ data: { is_subscribed: false } }),
    ])
      .then(([plansRes, subRes]) => {
        setPlans(plansRes.data.filter((p) => p.is_active));
        setMySub(subRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse font-bold uppercase text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24" data-testid="subscription-page">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-[var(--site-primary,#FFDE00)] border-2 border-zinc-950 mx-auto flex items-center justify-center mb-4">
            <Crown size={28} className="text-zinc-950" />
          </div>
          <h1
            className="font-['Outfit'] text-3xl md:text-5xl font-black uppercase tracking-tighter"
            style={{ color: settings.heading_color }}
          >
            Seja Assinante
          </h1>
          <p className="text-zinc-600 mt-3 max-w-lg mx-auto">
            Acesse lives exclusivas, vídeos e gravações disponíveis apenas para assinantes.
          </p>
        </div>

        {mySub?.is_subscribed && (
          <div className="brutalist-card p-6 mb-8 bg-green-50 border-green-500">
            <div className="flex items-center gap-3">
              <Check size={24} className="text-green-600" />
              <div>
                <p className="font-bold text-green-800">Você é assinante!</p>
                <p className="text-sm text-green-600">
                  Plano: {mySub.subscription?.plan_name} - Ativo até{" "}
                  {mySub.subscription?.expires_at
                    ? new Date(mySub.subscription?.expires_at).toLocaleDateString("pt-BR")
                    : "data não informada"}
                </p>
              </div>
            </div>
          </div>
        )}

        {!user && (
          <div className="brutalist-card p-6 mb-8 bg-[#FFDE00] text-center">
            <p className="font-bold text-zinc-950 uppercase mb-3">
              Faça login para acompanhar sua assinatura depois.
            </p>
            <Link to="/login" className="brutalist-btn-dark inline-block text-sm">
              Entrar / Cadastrar
            </Link>
          </div>
        )}

        {plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <div
                key={plan.id}
                className={`brutalist-card p-6 flex flex-col ${
                  plan.highlight ? "border-[var(--site-primary,#FFDE00)] border-4 relative" : ""
                }`}
                data-testid={`plan-card-${i}`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-4 bg-[var(--site-primary,#FFDE00)] text-zinc-950 px-3 py-0.5 text-xs font-black uppercase border-2 border-zinc-950">
                    Recomendado
                  </span>
                )}

                <h3 className="font-['Outfit'] font-bold text-xl uppercase mb-2">
                  {plan.name}
                </h3>

                <p className="text-sm text-zinc-600 mb-4 flex-1">
                  {plan.description}
                </p>

                <div className="mb-4">
                  <span className="font-['Outfit'] font-black text-3xl">
                    R$ {parseFloat(plan.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-zinc-500 text-sm">/{plan.duration_days} dias</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.access_lives !== false && (
                    <li className="flex items-center gap-2 text-sm">
                      <Check size={14} className="text-green-600" /> Lives exclusivas
                    </li>
                  )}
                  {plan.access_videos !== false && (
                    <li className="flex items-center gap-2 text-sm">
                      <Check size={14} className="text-green-600" /> Vídeos para assinantes
                    </li>
                  )}
                  {plan.access_recordings !== false && (
                    <li className="flex items-center gap-2 text-sm">
                      <Check size={14} className="text-green-600" /> Gravações de lives
                    </li>
                  )}
                  {plan.access_chat !== false && (
                    <li className="flex items-center gap-2 text-sm">
                      <Check size={14} className="text-green-600" /> Chat ao vivo
                    </li>
                  )}
                  {(plan.features || []).map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <Check size={14} className="text-green-600" /> {feature}
                    </li>
                  ))}
                </ul>

                {mySub?.is_subscribed ? (
                  <div className="text-center text-sm font-bold text-green-600 py-3">
                    Já assinante
                  </div>
                ) : (
                  <PaymentButton
                    title={`Assinatura ${plan.name}`}
                    price={Number(plan.price)}
                    type="assinatura"
                    referenceId={plan.id}
                  >
                    Assinar com Pix ou Cartão
                  </PaymentButton>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="brutalist-card p-12 text-center">
            <p className="text-zinc-500 font-bold uppercase">
              Nenhum plano disponível no momento
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
