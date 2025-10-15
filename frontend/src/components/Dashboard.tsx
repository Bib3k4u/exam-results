import { useEffect, useState } from "react";
import { addOrUpdateMarks, getMarks } from "../services/api";

const Dashboard = ({ student, onLogout }: any) => {
  const [marks, setMarks] = useState<any>(null);
  const [tr1, setTr1] = useState<number | string>("");
  const [tr2, setTr2] = useState<number | string>("");
  const [tr3, setTr3] = useState<number | string>("");
  const [msg, setMsg] = useState("");
  const [isCalculatingRank, setIsCalculatingRank] = useState(false);
  const [errors, setErrors] = useState({
    tr1: "",
    tr2: "",
    tr3: "",
  });

  useEffect(() => {
    loadMarks();
  }, []);

  const loadMarks = async () => {
    try {
      const data = await getMarks(student.id);
      if (data && (data.tr1 !== null || data.tr2 !== null || data.tr3 !== null)) {
        setMarks(data);
      }
    } catch (error) {
      console.log("No marks found for student, starting fresh");
      setMarks(null);
    }
  };

  const validateMark = (value: string, field: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setErrors({ ...errors, [field]: "Please enter a valid number" });
      return false;
    }
    if (num < 0 || num > 100) {
      setErrors({ ...errors, [field]: "Marks must be between 0 and 100" });
      return false;
    }
    setErrors({ ...errors, [field]: "" });
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    if (field === "tr1") setTr1(value);
    if (field === "tr2") setTr2(value);
    if (field === "tr3") setTr3(value);
    validateMark(value, field);
  };

  const isFormValid = () => {
    return (
      !errors.tr1 &&
      !errors.tr2 &&
      !errors.tr3 &&
      tr1 !== "" &&
      tr2 !== "" &&
      tr3 !== ""
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isFormValid()) {
      setMsg("❌ Please fix all errors before submitting");
      return;
    }
    try {
      const newMarks = {
        tr1: parseFloat(tr1 as string),
        tr2: parseFloat(tr2 as string),
        tr3: parseFloat(tr3 as string),
      };
      const savedMarks = await addOrUpdateMarks(student.id, newMarks);
      setMarks(savedMarks);
      if (!savedMarks.rank || savedMarks.rank === null) {
        setIsCalculatingRank(true);
        setMsg("✅ Marks saved! Calculating rank...");
        setTimeout(async () => {
          try {
            const updatedMarks = await getMarks(student.id);
            setMarks(updatedMarks);
            setMsg("✅ Marks saved and rank updated!");
            setIsCalculatingRank(false);
          } catch (error) {
            console.log("Failed to reload marks for rank update");
            setIsCalculatingRank(false);
          }
        }, 1500);
      } else {
        setMsg("✅ Marks saved successfully!");
      }
      setTr1("");
      setTr2("");
      setTr3("");
    } catch (error: any) {
      setMsg("❌ " + (error.message || "Failed to save marks"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {student.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome, {student.name}
                </h1>
                <p className="text-purple-200 text-sm">Student Dashboard</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500/80 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-red-400/30"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Form Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Update Marks</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* TR1 */}
              <div className="space-y-2">
                <label className="text-purple-200 text-sm font-medium block">
                  TR1 Score
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter TR1 marks (0-100)"
                  value={tr1}
                  onChange={(e) => handleChange(e, "tr1")}
                  className={`w-full bg-white/20 border ${
                    errors.tr1 ? "border-red-400" : "border-white/30"
                  } rounded-xl p-4 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300`}
                />
                {errors.tr1 && (
                  <p className="text-red-400 text-xs mt-1">{errors.tr1}</p>
                )}
              </div>

              {/* TR2 */}
              <div className="space-y-2">
                <label className="text-purple-200 text-sm font-medium block">
                  TR2 Score
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter TR2 marks (0-100)"
                  value={tr2}
                  onChange={(e) => handleChange(e, "tr2")}
                  className={`w-full bg-white/20 border ${
                    errors.tr2 ? "border-red-400" : "border-white/30"
                  } rounded-xl p-4 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300`}
                />
                {errors.tr2 && (
                  <p className="text-red-400 text-xs mt-1">{errors.tr2}</p>
                )}
              </div>

              {/* TR3 */}
              <div className="space-y-2">
                <label className="text-purple-200 text-sm font-medium block">
                  TR3 Score
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter TR3 marks (0-100)"
                  value={tr3}
                  onChange={(e) => handleChange(e, "tr3")}
                  className={`w-full bg-white/20 border ${
                    errors.tr3 ? "border-red-400" : "border-white/30"
                  } rounded-xl p-4 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-300`}
                />
                {errors.tr3 && (
                  <p className="text-red-400 text-xs mt-1">{errors.tr3}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isCalculatingRank || !isFormValid()}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                isCalculatingRank || !isFormValid()
                  ? "bg-gray-500/50 text-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-[1.02] shadow-lg hover:shadow-purple-500/25"
              }`}
            >
              {isCalculatingRank ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Calculating Rank...</span>
                </div>
              ) : (
                "💾 Save Marks"
              )}
            </button>
          </form>

          {/* Message */}
          {msg && (
            <div
              className={`mt-4 p-4 rounded-xl text-center font-medium ${
                msg.includes("✅")
                  ? "bg-green-500/20 text-green-200 border border-green-400/30"
                  : "bg-red-500/20 text-red-200 border border-red-400/30"
              }`}
            >
              {msg}
            </div>
          )}
        </div>

        {/* Table Section (unchanged) */}
        {marks && (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">
                Your Academic Performance
              </h2>
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/20">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      TR1
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      TR2
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                      TR3
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                      Total
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                      Selected
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                      Rank
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/5 divide-y divide-white/10">
                  <tr className="hover:bg-white/10 transition-colors duration-200">
                    <td className="px-6 py-4 text-white font-medium">
                      {marks.tr1}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {marks.tr2}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {marks.tr3}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {marks.total}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          marks.selected
                            ? "bg-green-500/20 text-green-200 border border-green-400/30"
                            : "bg-red-500/20 text-red-200 border border-red-400/30"
                        }`}
                      >
                        {marks.selected ? "✓ Selected" : "✗ Not Selected"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isCalculatingRank ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                          <span className="text-blue-300 text-sm">
                            Calculating...
                          </span>
                        </div>
                      ) : (
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          #{marks.rank ?? "Not ranked"}
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
