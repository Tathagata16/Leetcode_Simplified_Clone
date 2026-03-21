import fetch from "node-fetch";
const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

const TIMEOUT_MS = 5000;

export async function runCppCode(code, testCases) {
  try {
    const results = [];
    let allPassed = true;

    for (const tc of testCases) {
      const result = await runTestCase(code, tc.input, tc.expectedOutput);
      results.push(result);

      if (!result.passed) allPassed = false;
    }

    return { passed: allPassed, results };
  } catch (err) {
    return { passed: false, results: [], error: err.message };
  }
}

async function runTestCase(code, input, expectedOutput) {
  try {
    const response = await fetch(PISTON_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        language: "cpp",
        version: "10.2.0",
        files: [
          {
            name: "main.cpp",
            content: code
          }
        ],
        stdin: input,
        run_timeout: TIMEOUT_MS
      })
    });

    const data = await response.json();

    if (data.run?.stderr) {
      return {
        passed: false,
        input,
        expected: expectedOutput,
        got: data.run.stderr || "Runtime Error"
      };
    }

    const got = (data.run?.stdout || "").trim();
    const expected = expectedOutput.trim();

    return {
      passed: got === expected,
      input,
      expected,
      got
    };

  } catch (err) {
    return {
      passed: false,
      input,
      expected: expectedOutput,
      got: "Execution Error"
    };
  }
}