# Known Issues

## Test Drive Scheduling Authentication Bug

**Status:** Fixed  
**Severity:** Medium  
**Reported:** During hackathon development  
**Fixed:** Commit d8614fd

### Description
Users were unable to schedule test drives even when signed in. The `scheduleTestDrive` tool returned an authentication error: "Unable to verify your session. Please refresh the page and try again."

### Root Cause
The `scheduleTestDrive` tool executed in a server-side context but did not have access to request cookies/headers. The tool used `createSsrClient()` which relies on Next.js `cookies()` API, but tools execute in a different context than API route handlers and did not have access to the original request's cookies.

### Solution
Created `createToolsWithUserContext()` function that creates tools dynamically with user context closure. The route handler now passes the authenticated user and session (which have proper cookie access) to the tool creation function, allowing the `scheduleTestDrive` tool to access user information without needing to read cookies directly.

### Error Message
```
Error scheduling test drive
Unable to verify your session. Please refresh the page and try again. If the issue persists, please sign out and sign back in.
```

### Affected Code
- `web/app/api/chat/tools.ts` - `scheduleTestDriveTool.execute()`
- Tool execution context doesn't have access to request cookies

### Workaround
Users can manually schedule test drives through the `/test-drive` page or by refreshing the page and trying again.

### Potential Solutions
1. Pass user context from the route handler to tools (requires AI SDK support)
2. Use a different authentication method for tools (e.g., passing token through tool input)
3. Make the tool call an API endpoint that has proper request context
4. Use service role client with user ID passed through tool context

### Previous Commit Note
Commit `0adf1e3` incorrectly stated that test drive scheduling was "fully implemented" and working. This was inaccurate as the authentication issue was present but not discovered until user testing.

