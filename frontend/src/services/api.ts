export const API_BASE = "http://localhost:8080/api";

const safeParse = async (res: Response) => {
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return data;
  } catch {
    return { message: text };
  }
};

export const registerStudent = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_BASE}/student/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await safeParse(res);

  if (!res.ok) {
    // Backend returned error like 400
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

export const loginStudent = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/student/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await safeParse(res);

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const addOrUpdateMarks = async (studentId: string, marks: any) => {
  // First try to add marks
  let res = await fetch(`${API_BASE}/marks/add?studentId=${studentId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(marks),
  });

  let data = await safeParse(res);

  // If marks already exist, try update endpoint instead
  if (!res.ok && data.message?.includes("already exist")) {
    res = await fetch(`${API_BASE}/marks/update?studentId=${studentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(marks),
    });
    data = await safeParse(res);
  }

  if (!res.ok) {
    throw new Error(data.message || "Failed to add/update marks");
  }

  return data;
};

export const getMarks = async (studentId: string) => {
  // Try different possible endpoints for getting marks
  const possibleEndpoints = [
    `${API_BASE}/marks/get?studentId=${studentId}`,
    `${API_BASE}/marks/${studentId}`,
    `${API_BASE}/marks/student/${studentId}`
  ];

  for (const endpoint of possibleEndpoints) {
    try {
      const res = await fetch(endpoint);
      const data = await safeParse(res);

      if (res.ok) {
        return data;
      }
    } catch (error) {
      // Continue to next endpoint
      continue;
    }
  }

  // If all endpoints fail, return empty marks object
  return {
    id: studentId,
    tr1: null,
    tr2: null,
    tr3: null,
    total: null,
    selected: false,
    rank: null
  };
};