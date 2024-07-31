import { useState, useEffect } from "react";
import axios from "axios";

import LineChart from "../../components/Plots/Line";
import PieChart from "../../components/Plots/Pie";
import BarChart from "../../components/Plots/Bar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const url = "http://127.0.0.1:8000";

const Home = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [transactions_summary, setTransactionsSummary] = useState([]);
  const [loadingTransactions_sumarry, setLoadingTransactions_summary] = useState(true);
  const [averageMonthly, setAverageMonthly] = useState([]);
  const [loadingAverageMonthly, setLoadingAverageMonthly] = useState(true);
  const [transactions_porcentage, setTransactionsPorcentage] = useState([]);
  const [loadingTransactionsPorcentage, setLoadingTransactionsPorcentage] =
    useState(true);
  const [selectedAccount, setSelectedAccount] = useState(""); // Estado para la selección del <select>

  //useEffects con axios de some transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`${url}/transactions/`, {
          params: {
            limit: 10,
            offset: 0,
            account: selectedAccount,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoadingTransactions(false);
      }
    };

    fetchTransactions();
  }, [selectedAccount]);

  // useEffect para obtener cuentas únicas
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`${url}/transactions/unique_accounts`);
        setAccounts(response.data);
      } catch (error) {
        console.error("Error fetching Accounts:", error);
      } finally {
        setLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, []);

  // useEffect para obtener transactions summary
  useEffect(() => {
    const fetchTransactionsSummary = async () => {
      try {
        const response = await axios.get(`${url}/transactions/summary`, {
          params: {
            account: selectedAccount || "",
          },
        });
        setTransactionsSummary(response.data);
      } catch (error) {
        console.error("Error fetching Accounts:", error);
      } finally {
        setLoadingTransactions_summary(false);
      }
    };

    fetchTransactionsSummary();
  }, [selectedAccount]);

  // useEffect para obtener transactions summary/average-monthly
  useEffect(() => {
    const fetAchaverageMonthly = async () => {
      try {
        const response = await axios.get(`${url}/transactions/summary/average-monthly`, {
          params: {
            account: selectedAccount || "",
          },
        });
        setAverageMonthly(response.data);
      } catch (error) {
        console.error("Error fetching Accounts:", error);
      } finally {
        setLoadingAverageMonthly(false);
      }
    };

    fetAchaverageMonthly();
  }, [selectedAccount]);

  // useEffect para obtener transactions summary_total_amount_by_type
  useEffect(() => {
    const fetTransactionsPorcentage = async () => {
      try {
        const response = await axios.get(`${url}/transactions/summary/type/total`, {
          params: {
            account: selectedAccount || "",
          },
        });
        setTransactionsPorcentage(response.data);
      } catch (error) {
        console.error("Error fetching Accounts:", error);
      } finally {
        setLoadingTransactionsPorcentage(false);
      }
    };

    fetTransactionsPorcentage();
  }, [selectedAccount]);

  //formato tabla
  const header = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">Last Transactions</span>
    </div>
  );
  const footer = (
    <div className="mt-4">
      <span className="text-gray-500 italic">
        In total there are {transactions ? transactions.length : 0} transactions.
      </span>
    </div>
  );

  const formatDate = (transaction) => {
    return new Date(transaction.date).toLocaleDateString();
  };
  //FIN

  if (
    loadingAccounts &&
    loadingTransactions &&
    loadingTransactions_sumarry &&
    loadingAverageMonthly &&
    loadingTransactionsPorcentage
  ) {
    return (
      <div className="w-full h-screen flex justify-center m-auto">
        <p className="text-4xl m-auto">Loading...</p>
      </div>
    );
  }

  return (
    <div className="general-container w-full px-4 mt-4 flex flex-col justify-center">
      <div className="filters-container">
        <div className="filters">
          <h3>Filters</h3>
          <div>
            <label htmlFor="account">Account:</label>
            <select
              name="account"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)} // Actualiza el estado cuando cambia la selección
            >
              <option value="">Select an account</option>
              {accounts.map((account, index) => (
                <option key={index} value={account}>
                  {account}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="info-container mt-6 px-4 w-full flex flex-col justify-center">
        <DataTable
          className="border-2 border-gray-400 p-2 text-start"
          value={transactions}
          header={header}
          footer={footer}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            className="border-2 border-gray-300"
            field="account"
            header="Account"
          ></Column>
          <Column
            className="border-2 border-gray-300"
            field="type.name"
            header="Type"
          ></Column>
          <Column
            className="border-2 border-gray-300"
            field="category"
            header="Category"
          ></Column>
          <Column
            className="border-2 border-gray-300"
            field="quantity"
            header="Quantity"
          ></Column>
          <Column
            className="border-2 border-gray-300"
            field="date"
            body={formatDate}
            header="Date"
          ></Column>
        </DataTable>
        {/* info chart puntos */}
        <div className="info-charts w-full">
          <div className="top-chart w-full mt-8">
            <span className="flex text-start font-bold text-xl pb-4">
              Summary_by_date_and_type
            </span>
            <LineChart data={transactions_summary} selectedAccount={selectedAccount} />
          </div>
          <div className="bottom-chart w-full mt-6">
            <div className="left-chart w-full">
              <span className="flex text-start font-bold text-xl pb-4">
                Summary_avg_amount_monthly_by_type
              </span>
              <BarChart data={averageMonthly} selectedAccount={selectedAccount} />
            </div>
            <div className="right-chart w-full m-6">
              <span className="flex text-start font-bold text-xl pb-4">
                Summary_avg_amount_monthly_by_type
              </span>
              <PieChart data={transactions_porcentage} selectedAccount={selectedAccount} barPadding={1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
