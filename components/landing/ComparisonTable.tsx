const ROWS = [
  { label: "Prix mensuel", vitrine: "19–49€", agence: "2 000€+", wp: "50€+" },
  { label: "Délai mise en ligne", vitrine: "5 min", agence: "4–8 sem.", wp: "2–4 sem." },
  { label: "Design premium", vitrine: "✓", agence: "✓", wp: "△" },
  { label: "Maintenance", vitrine: "Incluse", agence: "Facturée", wp: "Manuelle" },
  { label: "Domaine custom", vitrine: "✓ (Pro)", agence: "✓", wp: "✓" },
];

export function ComparisonTable() {
  return (
    <section className="px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-syne text-4xl font-bold">
          VitrineLab vs le reste
        </h2>
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 font-medium" scope="col" />
                <th className="p-4 font-semibold text-blue-600" scope="col">
                  VitrineLab
                </th>
                <th className="p-4 font-medium text-slate-600" scope="col">
                  Agence
                </th>
                <th className="p-4 font-medium text-slate-600" scope="col">
                  WordPress
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label} className="border-b border-slate-100">
                  <th className="p-4 font-medium text-slate-900" scope="row">
                    {row.label}
                  </th>
                  <td className="p-4 font-medium text-blue-600">{row.vitrine}</td>
                  <td className="p-4 text-slate-600">{row.agence}</td>
                  <td className="p-4 text-slate-600">{row.wp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
