import React, { useEffect, useState } from "react";
import "./Reportes.css";
import { Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend,
  Title
} from "chart.js";

ChartJS.register(
  BarElement, 
  CategoryScale, 
  LinearScale, 
  Tooltip, 
  Legend,
  Title
);

const Reportes = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("ultimos_6_meses");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Cambia aquí la URL al endpoint PHP:
        const response = await fetch(`http://localhost/api/reportes.php?rango=${timeRange}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al cargar reportes");
        }

        setReportData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setReportData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const chartData = {
    labels: reportData.map(r => r.mes),
    datasets: [
      {
        label: "Ventas ($)",
        data: reportData.map(r => r.ventas),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Pedidos",
        data: reportData.map(r => r.pedidos),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Resumen de Ventas y Pedidos',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.dataset.label.includes('Ventas') 
                ? `$${context.parsed.y.toLocaleString()}` 
                : context.parsed.y;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      }
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="reportes-container">
        <div className="loading-spinner"></div>
        <p>Cargando reportes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="reportes-container">
        <div className="error-message">
          <h3>Error al cargar reportes</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="reportes-container">
      <div className="reportes-header">
        <h2>Reportes de Ventas</h2>
        <div className="time-range-selector">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="ultimos_3_meses">Últimos 3 meses</option>
            <option value="ultimos_6_meses">Últimos 6 meses</option>
            <option value="ultimos_12_meses">Últimos 12 meses</option>
            <option value="este_año">Este año</option>
          </select>
        </div>
      </div>

      <div className="reportes-summary">
        <div className="summary-card">
          <h3>Total Ventas</h3>
          <p>
            {formatCurrency(
              reportData.reduce((sum, item) => sum + item.ventas, 0)
            )}
          </p>
        </div>
        <div className="summary-card">
          <h3>Total Pedidos</h3>
          <p>
            {reportData.reduce((sum, item) => sum + item.pedidos, 0).toLocaleString()}
          </p>
        </div>
        <div className="summary-card">
          <h3>Promedio por Pedido</h3>
          <p>
            {formatCurrency(
              reportData.reduce((sum, item) => sum + item.ventas, 0) / 
              Math.max(reportData.reduce((sum, item) => sum + item.pedidos, 0), 1)
            )}
          </p>
        </div>
      </div>

      <div className="reportes-chart-container">
        <div className="chart-wrapper">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="reportes-table-container">
        <h3>Detalle Mensual</h3>
        <table className="reportes-table">
          <thead>
            <tr>
              <th>Mes</th>
              <th>Ventas</th>
              <th>Pedidos</th>
              <th>Promedio</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.mes}</td>
                <td>{formatCurrency(row.ventas)}</td>
                <td>{row.pedidos.toLocaleString()}</td>
                <td>{formatCurrency(row.ventas / Math.max(row.pedidos, 1))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reportes;