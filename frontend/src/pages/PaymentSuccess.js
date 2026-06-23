import { Link, useLocation } from "react-router-dom";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export default function PaymentSuccess({ status: forcedStatus }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const status = forcedStatus || params.get("status") || "success";

  const isSuccess = status === "success" || status === "approved";
  const isPending = status === "pending";

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" data-testid="payment-result-page">
      <div className="brutalist-card p-8 md:p-12 text-center max-w-lg w-full">
        {isSuccess && (
          <>
            <div className="w-16 h-16 bg-green-100 border-2 border-green-600 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h1 className="font-['Outfit'] text-2xl font-black uppercase mb-2 text-green-700">
              Pagamento iniciado!
            </h1>
            <p className="text-zinc-600 mb-6">
              Se o Mercado Pago confirmou o pagamento, sua compra foi processada por lá.
            </p>
          </>
        )}

        {isPending && (
          <>
            <div className="w-16 h-16 bg-yellow-100 border-2 border-yellow-600 mx-auto mb-4 flex items-center justify-center">
              <Clock size={32} className="text-yellow-700" />
            </div>
            <h1 className="font-['Outfit'] text-2xl font-black uppercase mb-2 text-yellow-700">
              Pagamento pendente
            </h1>
            <p className="text-zinc-600 mb-6">
              O Mercado Pago ainda está aguardando a confirmação do pagamento.
            </p>
          </>
        )}

        {!isSuccess && !isPending && (
          <>
            <div className="w-16 h-16 bg-red-100 border-2 border-red-600 mx-auto mb-4 flex items-center justify-center">
              <XCircle size={32} className="text-red-600" />
            </div>
            <h1 className="font-['Outfit'] text-2xl font-black uppercase mb-2 text-red-700">
              Pagamento não concluído
            </h1>
            <p className="text-zinc-600 mb-6">
              Você pode voltar ao site e tentar novamente.
            </p>
          </>
        )}

        <Link to="/" className="brutalist-btn inline-block" data-testid="back-home-btn">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
