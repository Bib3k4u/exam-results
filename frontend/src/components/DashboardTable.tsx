import { useEffect, useState } from "react";
import {
  getDashboardData,
  updateStudentMarks,
  addOrUpdateMarks,
} from "../services/api";

interface DashboardStudent {
  studentId: string;
  name: string;
  email: string;
  tr1: number | null;
  tr2: number | null;
  tr3: number | null;
  total: number | null;
  selected: boolean | null;
  rank: number | null;
}

interface DashboardTableProps {
  currentStudent: any;
  onLogout: () => void;
}

const DashboardTable = ({ currentStudent, onLogout }: DashboardTableProps) => {
  const [students, setStudents] = useState<DashboardStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    tr1: "",
    tr2: "",
    tr3: "",
  });
  const [editErrors, setEditErrors] = useState({
    tr1: "",
    tr2: "",
    tr3: "",
  });
  const [updateMessage, setUpdateMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    tr1: "",
    tr2: "",
    tr3: "",
  });
  const [addErrors, setAddErrors] = useState({
    tr1: "",
    tr2: "",
    tr3: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardData();
      setStudents(data);
      setError("");

      // Check if current student has marks
      const currentStudentHasMarks = data.some(
        (student: DashboardStudent) => student.studentId === currentStudent.id
      );
      setShowAddForm(!currentStudentHasMarks);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
      // If no data, show add form for current student
      setShowAddForm(true);
    } finally {
      setLoading(false);
    }
  };

  const validateMark = (
    value: string,
    field: string,
    isEdit: boolean = true
  ) => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      if (isEdit) {
        setEditErrors({
          ...editErrors,
          [field]: "Please enter a valid number",
        });
      } else {
        setAddErrors({ ...addErrors, [field]: "Please enter a valid number" });
      }
      return false;
    }
    if (num < 0 || num > 100) {
      if (isEdit) {
        setEditErrors({
          ...editErrors,
          [field]: "Marks must be between 0 and 100",
        });
      } else {
        setAddErrors({
          ...addErrors,
          [field]: "Marks must be between 0 and 100",
        });
      }
      return false;
    }
    if (isEdit) {
      setEditErrors({ ...editErrors, [field]: "" });
    } else {
      setAddErrors({ ...addErrors, [field]: "" });
    }
    return true;
  };

  const handleEditStart = (student: DashboardStudent) => {
    if (student.studentId !== currentStudent.id) {
      setUpdateMessage("❌ You can only edit your own marks");
      return;
    }

    setEditingStudent(student.studentId);
    setEditForm({
      tr1: student.tr1?.toString() || "",
      tr2: student.tr2?.toString() || "",
      tr3: student.tr3?.toString() || "",
    });
    setEditErrors({ tr1: "", tr2: "", tr3: "" });
    setUpdateMessage("");
  };

  const handleEditCancel = () => {
    setEditingStudent(null);
    setEditForm({ tr1: "", tr2: "", tr3: "" });
    setEditErrors({ tr1: "", tr2: "", tr3: "" });
    setUpdateMessage("");
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value;
    setEditForm({ ...editForm, [field]: value });
    validateMark(value, field, true);
  };

  const handleAddChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value;
    setAddForm({ ...addForm, [field]: value });
    validateMark(value, field, false);
  };

  const isEditFormValid = () => {
    return (
      !editErrors.tr1 &&
      !editErrors.tr2 &&
      !editErrors.tr3 &&
      editForm.tr1 !== "" &&
      editForm.tr2 !== "" &&
      editForm.tr3 !== ""
    );
  };

  const isAddFormValid = () => {
    return (
      !addErrors.tr1 &&
      !addErrors.tr2 &&
      !addErrors.tr3 &&
      addForm.tr1 !== "" &&
      addForm.tr2 !== "" &&
      addForm.tr3 !== ""
    );
  };

  const handleEditSave = async (studentId: string) => {
    if (!isEditFormValid()) {
      setUpdateMessage("❌ Please fix all errors before saving");
      return;
    }

    try {
      setIsUpdating(true);
      const updatedMarks = {
        tr1: parseFloat(editForm.tr1),
        tr2: parseFloat(editForm.tr2),
        tr3: parseFloat(editForm.tr3),
      };

      await updateStudentMarks(studentId, updatedMarks);

      // Reload dashboard data to get updated rankings
      await loadDashboardData();

      setEditingStudent(null);
      setUpdateMessage("✅ Marks updated successfully!");

      // Clear message after 3 seconds
      setTimeout(() => setUpdateMessage(""), 3000);
    } catch (err: any) {
      setUpdateMessage("❌ " + (err.message || "Failed to update marks"));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddMarks = async () => {
    if (!isAddFormValid()) {
      setUpdateMessage("❌ Please fix all errors before submitting");
      return;
    }

    try {
      setIsAdding(true);
      const newMarks = {
        tr1: parseFloat(addForm.tr1),
        tr2: parseFloat(addForm.tr2),
        tr3: parseFloat(addForm.tr3),
      };

      await addOrUpdateMarks(currentStudent.id, newMarks);

      // Reload dashboard data to get updated rankings
      await loadDashboardData();

      setAddForm({ tr1: "", tr2: "", tr3: "" });
      setAddErrors({ tr1: "", tr2: "", tr3: "" });
      setShowAddForm(false);
      setUpdateMessage("✅ Marks added successfully!");

      // Clear message after 3 seconds
      setTimeout(() => setUpdateMessage(""), 3000);
    } catch (err: any) {
      setUpdateMessage("❌ " + (err.message || "Failed to add marks"));
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Dashboard
          </h3>
          <p className="text-gray-600">Fetching academic data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">
                  {currentStudent.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome, {currentStudent.name}
                </h1>
                <p className="text-gray-600 text-sm font-medium">
                  Academic Performance Dashboard
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Message */}
        {updateMessage && (
          <div
            className={`p-4 rounded-lg text-center font-medium shadow-sm ${
              updateMessage.includes("✅")
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {updateMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg text-center font-medium bg-red-50 text-red-800 border border-red-200 shadow-sm">
            {error}
          </div>
        )}

        {/* Add Marks Form - Show if current student doesn't have marks */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Add Your Academic Marks
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Enter your examination scores to get ranked
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddMarks();
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* TR1 */}
                  <div className="space-y-2">
                    <label className="text-gray-700 text-sm font-semibold block">
                      Term 1 Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Enter marks (0-100)"
                      value={addForm.tr1}
                      onChange={(e) => handleAddChange(e, "tr1")}
                      className={`w-full border-2 ${
                        addErrors.tr1
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 focus:border-blue-500"
                      } rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
                    />
                    {addErrors.tr1 && (
                      <p className="text-red-600 text-xs mt-1 font-medium">
                        {addErrors.tr1}
                      </p>
                    )}
                  </div>

                  {/* TR2 */}
                  <div className="space-y-2">
                    <label className="text-gray-700 text-sm font-semibold block">
                      Term 2 Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Enter marks (0-100)"
                      value={addForm.tr2}
                      onChange={(e) => handleAddChange(e, "tr2")}
                      className={`w-full border-2 ${
                        addErrors.tr2
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 focus:border-blue-500"
                      } rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
                    />
                    {addErrors.tr2 && (
                      <p className="text-red-600 text-xs mt-1 font-medium">
                        {addErrors.tr2}
                      </p>
                    )}
                  </div>

                  {/* TR3 */}
                  <div className="space-y-2">
                    <label className="text-gray-700 text-sm font-semibold block">
                      Term 3 Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="Enter marks (0-100)"
                      value={addForm.tr3}
                      onChange={(e) => handleAddChange(e, "tr3")}
                      className={`w-full border-2 ${
                        addErrors.tr3
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 focus:border-blue-500"
                      } rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200`}
                    />
                    {addErrors.tr3 && (
                      <p className="text-red-600 text-xs mt-1 font-medium">
                        {addErrors.tr3}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={!isAddFormValid() || isAdding}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      !isAddFormValid() || isAdding
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {isAdding ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      "📝 Submit Marks"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setAddForm({ tr1: "", tr2: "", tr3: "" });
                      setAddErrors({ tr1: "", tr2: "", tr3: "" });
                    }}
                    className="px-6 py-3 rounded-lg font-semibold text-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dashboard Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
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
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Academic Rankings
                  </h2>
                  <p className="text-green-100 text-sm">
                    Live performance dashboard
                  </p>
                </div>
              </div>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium backdrop-blur-sm"
                >
                  + Add Your Marks
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Term 1
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Term 2
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Term 3
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <svg
                          className="w-12 h-12 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <p className="text-lg font-medium">
                          No students with marks found
                        </p>
                        <p className="text-sm">
                          Be the first to add your academic marks!
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <tr
                      key={student.studentId}
                      className={`hover:bg-gray-50 transition-colors duration-200 ${
                        student.studentId === currentStudent.id
                          ? "bg-blue-50 border-l-4 border-blue-500"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-center">
                        {student.rank ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                            #{student.rank}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {student.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
                              <span>{student.name}</span>
                              {student.studentId === currentStudent.id && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {editingStudent === student.studentId ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editForm.tr1}
                            onChange={(e) => handleEditChange(e, "tr1")}
                            className={`w-20 border-2 ${
                              editErrors.tr1
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-lg px-2 py-1 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-200`}
                          />
                        ) : (
                          <span className="text-gray-900 font-semibold">
                            {student.tr1 ?? "-"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {editingStudent === student.studentId ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editForm.tr2}
                            onChange={(e) => handleEditChange(e, "tr2")}
                            className={`w-20 border-2 ${
                              editErrors.tr2
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-lg px-2 py-1 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-200`}
                          />
                        ) : (
                          <span className="text-gray-900 font-semibold">
                            {student.tr2 ?? "-"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {editingStudent === student.studentId ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={editForm.tr3}
                            onChange={(e) => handleEditChange(e, "tr3")}
                            className={`w-20 border-2 ${
                              editErrors.tr3
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 focus:border-blue-500"
                            } rounded-lg px-2 py-1 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-blue-200`}
                          />
                        ) : (
                          <span className="text-gray-900 font-semibold">
                            {student.tr3 ?? "-"}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                          {student.total ?? "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            student.selected
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.selected ? (
                            <>
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Selected
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Not Selected
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {editingStudent === student.studentId ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditSave(student.studentId)}
                              disabled={!isEditFormValid() || isUpdating}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                isEditFormValid() && !isUpdating
                                  ? "bg-green-600 hover:bg-green-700 text-white shadow-sm"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              {isUpdating ? (
                                <div className="flex items-center space-x-1">
                                  <div className="w-3 h-3 border-2 border-gray-400/30 border-t-gray-400 rounded-full animate-spin"></div>
                                  <span>Saving...</span>
                                </div>
                              ) : (
                                "Save"
                              )}
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditStart(student)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              student.studentId === currentStudent.id
                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                            disabled={student.studentId !== currentStudent.id}
                          >
                            {student.studentId === currentStudent.id
                              ? "Edit"
                              : "View Only"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTable;
