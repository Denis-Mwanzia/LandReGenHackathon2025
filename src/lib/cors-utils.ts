/**
 * CORS Utility Functions
 * Handles CORS-related operations and debugging
 */

export interface CORSConfig {
  origin: string;
  methods: string[];
  headers: string[];
  credentials: boolean;
}

export const DEFAULT_CORS_CONFIG: CORSConfig = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  headers: [
    'Content-Type',
    'Authorization',
    'apikey',
    'x-requested-with',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  credentials: false,
};

/**
 * Test CORS connectivity to Supabase
 */
export const testSupabaseCORS = async (): Promise<{
  success: boolean;
  error?: string;
  details?: any;
}> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      success: false,
      error: 'Missing Supabase environment variables',
      details: {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseKey,
        currentOrigin: window.location.origin,
      },
    };
  }

  try {
    // Test basic connectivity
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });

    const details = {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      url: response.url,
      origin: window.location.origin,
      supabaseUrl,
    };

    if (response.ok) {
      return { success: true, details };
    } else {
      return {
        success: false,
        error: `HTTP ${response.status}: ${response.statusText}`,
        details,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Unknown error',
      details: {
        errorType: error.name,
        message: error.message,
        origin: window.location.origin,
        supabaseUrl,
      },
    };
  }
};

/**
 * Check if CORS error is likely a configuration issue
 */
export const diagnoseCORSError = (error: any): string[] => {
  const issues: string[] = [];

  if (error.message?.includes('denied') || error.name === 'SecurityError') {
    issues.push('CORS policy violation detected');
  }

  if (error.message?.includes('NetworkError')) {
    issues.push('Network connectivity issue');
  }

  if (error.message?.includes('Failed to fetch')) {
    issues.push('Request failed - check network and server availability');
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    issues.push('Missing VITE_SUPABASE_URL environment variable');
  } else if (!supabaseUrl.includes('supabase.co')) {
    issues.push('Invalid Supabase URL format');
  }

  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseKey) {
    issues.push('Missing VITE_SUPABASE_ANON_KEY environment variable');
  }

  return issues;
};

/**
 * Generate CORS troubleshooting report
 */
export const generateCORSTroubleshootingReport = async (): Promise<string> => {
  const test = await testSupabaseCORS();
  const currentOrigin = window.location.origin;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

  let report = `# CORS Troubleshooting Report\n\n`;
  report += `**Generated:** ${new Date().toISOString()}\n`;
  report += `**Current Origin:** ${currentOrigin}\n`;
  report += `**Supabase URL:** ${supabaseUrl || 'Not set'}\n\n`;

  if (test.success) {
    report += `✅ **CORS Test:** PASSED\n`;
    report += `- Status: ${test.details?.status}\n`;
    report += `- Response: ${test.details?.statusText}\n`;
  } else {
    report += `❌ **CORS Test:** FAILED\n`;
    report += `- Error: ${test.error}\n`;
    report += `- Details: ${JSON.stringify(test.details, null, 2)}\n`;
  }

  report += `\n## Recommended Actions:\n\n`;

  if (!test.success) {
    report += `1. **Verify Supabase Project Settings:**\n`;
    report += `   - Go to Supabase Dashboard → Settings → API\n`;
    report += `   - Set Site URL to: \`${currentOrigin}\`\n`;
    report += `   - Add to Additional redirect URLs: \`${currentOrigin}\`\n\n`;

    report += `2. **Check Environment Variables:**\n`;
    report += `   - Ensure .env file exists in project root\n`;
    report += `   - Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set\n`;
    report += `   - Restart development server after changes\n\n`;

    report += `3. **Verify Supabase Project Status:**\n`;
    report += `   - Check if project is active (not paused)\n`;
    report += `   - Free tier projects may be paused after inactivity\n\n`;

    report += `4. **Browser Cache:**\n`;
    report += `   - Clear browser cache and cookies\n`;
    report += `   - Try incognito/private mode\n`;
    report += `   - Hard refresh (Ctrl+Shift+R)\n\n`;
  }

  return report;
};

/**
 * Log CORS configuration for debugging
 */
export const logCORSConfiguration = (): void => {
  // CORS configuration logging removed for production
};
