// import fetch from "node-fetch";
// const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

// const TIMEOUT_MS = 5000;

// export async function runCppCode(code, testCases) {
//   try {
//     const results = [];
//     let allPassed = true;

//     for (const tc of testCases) {
//       const result = await runTestCase(code, tc.input, tc.expectedOutput);
//       results.push(result);

//       if (!result.passed) allPassed = false;
//     }

//     return { passed: allPassed, results };
//   } catch (err) {
//     return { passed: false, results: [], error: err.message };
//   }
// }

// async function runTestCase(code, input, expectedOutput) {
//   try {
//     const response = await fetch(PISTON_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         language: "cpp",
//         version: "10.2.0",
//         files: [
//           {
//             name: "main.cpp",
//             content: code
//           }
//         ],
//         stdin: input,
//         run_timeout: TIMEOUT_MS
//       })
//     });

//     const data = await response.json();

//     if (data.run?.stderr) {
//       return {
//         passed: false,
//         input,
//         expected: expectedOutput,
//         got: data.run.stderr || "Runtime Error"
//       };
//     }

//     const got = (data.run?.stdout || "").trim();
//     const expected = expectedOutput.trim();

//     return {
//       passed: got === expected,
//       input,
//       expected,
//       got
//     };

//   } catch (err) {
//     return {
//       passed: false,
//       input,
//       expected: expectedOutput,
//       got: "Execution Error"
//     };
//   }
// }


import fetch from "node-fetch";

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";
const TIMEOUT_MS = 5000;
const FETCH_TIMEOUT_MS = 10000; // hard timeout on the fetch itself

export async function runCppCode(code, testCases) {
  try {
    // Fix 1: Run all test cases in parallel instead of sequentially
    const results = await Promise.all(
      testCases.map(tc => runTestCase(code, tc.input, tc.expectedOutput))
    );

    // Check if any result has a compile error (same error for all since same code)
    const compileError = results.find(r => r.isCompileError);
    if (compileError) {
      return { passed: false, results, error: compileError.error };
    }

    const allPassed = results.every(r => r.passed);
    return { passed: allPassed, results };
  } catch (err) {
    return { passed: false, results: [], error: err.message };
  }
}

async function runTestCase(code, input, expectedOutput) {
  // Fix 2: AbortController so fetch doesn't hang forever
  const controller = new AbortController();
  const fetchTimer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(PISTON_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        language: "cpp",
        version: "*",//changed to * from version 10.2.something
        files: [{ name: "main.cpp", content: code }],
        // Fix 3: Empty string stdin causes issues — send a space if empty
        stdin: input || "",
        run_timeout: TIMEOUT_MS,
        compile_timeout: 10000,
      }),
    });

    clearTimeout(fetchTimer);
    const data = await response.json();

    // Fix 4: Catch compile errors separately before checking run stderr
    if (data.compile?.stderr) {
      return {
        passed: false,
        input,
        expected: expectedOutput,
        got: "Compile Error",
        error: data.compile.stderr,
        isCompileError: true,
      };
    }

    // Fix 5: TLE — Piston sets signal to "SIGKILL" on timeout
    if (data.run?.signal === "SIGKILL") {
      return {
        passed: false,
        input,
        expected: expectedOutput,
        got: "Time Limit Exceeded",
      };
    }

    // Runtime error — stderr present but no compile error
    if (data.run?.stderr) {
      return {
        passed: false,
        input,
        expected: expectedOutput,
        got: "Runtime Error",
        error: data.run.stderr,
      };
    }

    const got = (data.run?.stdout || "").trim();
    const expected = expectedOutput.trim();

    return { passed: got === expected, input, expected, got };

  } catch (err) {
    clearTimeout(fetchTimer);

    // Fix 6: Distinguish fetch timeout from other errors
    if (err.name === "AbortError") {
      return {
        passed: false,
        input,
        expected: expectedOutput,
        got: "Judge Unavailable (timeout)",
      };
    }

    return {
      passed: false,
      input,
      expected: expectedOutput,
      got: "Execution Error",
      error: err.message,
    };
  }
}