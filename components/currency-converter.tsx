
  "use client";

  import { useState, useEffect, ChangeEvent } from "react";
  import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardFooter,
  } from "./ui/card";
  import { Label } from "./ui/label";
  import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
  } from "./ui/select";
  import { Input } from "./ui/input";
  import { Button } from "./ui/button";
  import { Rings } from "react-loader-spinner";

  export default function CurrencyConverter() {
    type ExchangeRates = {
      [key: string]: number;
    };

    type Currency = "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "PKR";
    const [amount, setAmount] = useState<number | null>(null);
    const [sourceCurrency, setSourceCurrency] = useState<Currency>("USD");
    const [targetCurrency, setTargetCurrency] = useState<Currency>("PKR");
    const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
    const [convertedAmount, setConvertedAmount] = useState<string>("0.00");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchExchangeRates = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            "https://api.exchangerate-api.com/v4/latest/USD"
          );
          const data = await response.json();
          setExchangeRates(data.rates);
        } catch (error) {
          setError("Error fetching exchange rates.");
        } finally {
          setLoading(false);
        }
      };
      fetchExchangeRates();
    }, []);

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
      setAmount(parseFloat(e.target.value));
    };

    const handleSourceCurrencyChange = (value: Currency): void => {
      setSourceCurrency(value);
    };

    const handleTargetCurrencyChange = (value: Currency): void => {
      setTargetCurrency(value);
    };

    const calculateConvertedAmount = (): void => {
      if (sourceCurrency && targetCurrency && exchangeRates && amount) {
        const rate =
          sourceCurrency === "USD"
            ? exchangeRates[targetCurrency]
            : exchangeRates[targetCurrency] / exchangeRates[sourceCurrency];

        const result = amount * rate;
        setConvertedAmount(result.toFixed(2));
      }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-bl from-pink-50 to-cyan-50">
        <Card className="w-full max-w-lg p-6 space-y-6 shadow-lg rounded-lg bg-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-semibold text-gray-800">
              Currency Converter
            </CardTitle>
            <CardDescription className="text-gray-500">
              Convert between different currencies easily
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center">
                <Rings color="#4CAF50" height={80} width={80} />
              </div>
            ) : error ? (
              <div className="text-red-600 text-center">{error}</div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="from" className="text-gray-700">
                    From
                  </Label>
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={amount || ""}
                    onChange={handleAmountChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    id="from"
                  />
                  <Select
                    value={sourceCurrency}
                    onValueChange={handleSourceCurrencyChange}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="PKR">PKR</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4">
                  <Label htmlFor="to" className="text-gray-700">
                    To
                  </Label>
                  <div className="text-xl font-bold text-gray-800">
                    {convertedAmount}
                  </div>
                  <Select
                    value={targetCurrency}
                    onValueChange={handleTargetCurrencyChange}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="EUR" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="JPY">JPY</SelectItem>
                        <SelectItem value="AUD">AUD</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="PKR">PKR</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
            variant={"default"}
              type="button"
              className="w-full  text-white py-2 px-4 rounded-md "
              onClick={calculateConvertedAmount}
            >
              Convert
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
