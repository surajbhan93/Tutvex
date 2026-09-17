/**
 * SEO Validation Utility
 * Validates SEO metadata for tutor profile pages to ensure optimization standards are met
 */

export interface SEOValidationResult {
  isValid: boolean;
  score: number;
  checks: {
    titleLength: ValidationCheck;
    titleFormat: ValidationCheck;
    metaDescriptionLength: ValidationCheck;
    metaDescriptionQuality: ValidationCheck;
    canonicalExists: ValidationCheck;
    ogImageExists: ValidationCheck;
    ogTitleExists: ValidationCheck;
    ogDescriptionExists: ValidationCheck;
    twitterCardExists: ValidationCheck;
    twitterImageExists: ValidationCheck;
    keywordsPresent: ValidationCheck;
    structuredDataExists: ValidationCheck;
  };
  warnings: string[];
  errors: string[];
  suggestions: string[];
}

export interface ValidationCheck {
  passed: boolean;
  value?: string | number | boolean;
  expected?: string;
  message: string;
}

export interface SEOMetadata {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: any;
}

/**
 * Validate title length and format
 */
function validateTitle(title?: string): ValidationCheck {
  if (!title) {
    return {
      passed: false,
      message: "Title is missing",
    };
  }

  const length = title.length;
  const minLength = 30;
  const maxLength = 60;

  if (length < minLength) {
    return {
      passed: false,
      value: length,
      expected: `${minLength}-${maxLength} characters`,
      message: `Title is too short (${length} chars). Aim for ${minLength}-${maxLength} characters.`,
    };
  }

  if (length > maxLength) {
    return {
      passed: false,
      value: length,
      expected: `${minLength}-${maxLength} characters`,
      message: `Title is too long (${length} chars). It may be truncated in search results.`,
    };
  }

  return {
    passed: true,
    value: length,
    expected: `${minLength}-${maxLength} characters`,
    message: `Title length is optimal (${length} chars)`,
  };
}

/**
 * Validate title contains important keywords
 */
function validateTitleFormat(title?: string): ValidationCheck {
  if (!title) {
    return {
      passed: false,
      message: "Title is missing",
    };
  }

  const hasLocation = /\b(in|near)\s+[A-Z][a-z]+/.test(title);
  const hasBrandName = /tutvex/i.test(title);
  const hasRole = /tutor|teacher|instructor/i.test(title);

  if (!hasLocation) {
    return {
      passed: false,
      message: "Title should include location (e.g., 'in Prayagraj') for local SEO",
    };
  }

  if (!hasBrandName) {
    return {
      passed: false,
      message: "Title should include brand name 'Tutvex' for brand recognition",
    };
  }

  if (!hasRole) {
    return {
      passed: false,
      message: "Title should include role keyword (e.g., 'Tutor', 'Teacher')",
    };
  }

  return {
    passed: true,
    message: "Title format is SEO-optimized with location, role, and brand",
  };
}

/**
 * Validate meta description length and quality
 */
function validateMetaDescription(description?: string): ValidationCheck {
  if (!description) {
    return {
      passed: false,
      message: "Meta description is missing",
    };
  }

  const length = description.length;
  const minLength = 120;
  const maxLength = 160;

  if (length < minLength) {
    return {
      passed: false,
      value: length,
      expected: `${minLength}-${maxLength} characters`,
      message: `Meta description is too short (${length} chars). Aim for ${minLength}-${maxLength} characters.`,
    };
  }

  if (length > maxLength) {
    return {
      passed: false,
      value: length,
      expected: `${minLength}-${maxLength} characters`,
      message: `Meta description is too long (${length} chars). It may be truncated in search results.`,
    };
  }

  return {
    passed: true,
    value: length,
    expected: `${minLength}-${maxLength} characters`,
    message: `Meta description length is optimal (${length} chars)`,
  };
}

/**
 * Validate meta description quality (contains CTA, value props)
 */
function validateMetaDescriptionQuality(description?: string): ValidationCheck {
  if (!description) {
    return {
      passed: false,
      message: "Meta description is missing",
    };
  }

  const hasCTA = /(book|contact|learn|call|schedule|get|join|start)/i.test(description);
  const hasValueProp = /(experience|expert|qualified|proven|certified|verified|best|top)/i.test(description);
  const hasNumbers = /\d+/.test(description);

  let score = 0;
  const feedback: string[] = [];

  if (hasCTA) {
    score++;
  } else {
    feedback.push("Add a call-to-action (e.g., 'Book a free demo')");
  }

  if (hasValueProp) {
    score++;
  } else {
    feedback.push("Include value propositions (e.g., 'experienced', 'verified')");
  }

  if (hasNumbers) {
    score++;
  } else {
    feedback.push("Add specific numbers (e.g., '5+ years experience')");
  }

  if (score === 3) {
    return {
      passed: true,
      message: "Meta description has good quality with CTA, value props, and specifics",
    };
  }

  return {
    passed: score >= 2,
    value: score,
    message: `Meta description quality: ${score}/3. ${feedback.join(". ")}`,
  };
}

/**
 * Main validation function
 */
export function validateTutorSEO(metadata: SEOMetadata): SEOValidationResult {
  const checks = {
    titleLength: validateTitle(metadata.title),
    titleFormat: validateTitleFormat(metadata.title),
    metaDescriptionLength: validateMetaDescription(metadata.description),
    metaDescriptionQuality: validateMetaDescriptionQuality(metadata.description),
    canonicalExists: {
      passed: !!metadata.canonical,
      value: !!metadata.canonical,
      message: metadata.canonical
        ? "Canonical URL is present"
        : "Canonical URL is missing - important for duplicate content prevention",
    },
    ogImageExists: {
      passed: !!metadata.ogImage,
      value: !!metadata.ogImage,
      message: metadata.ogImage
        ? "Open Graph image is present"
        : "Open Graph image is missing - important for social sharing",
    },
    ogTitleExists: {
      passed: !!metadata.ogTitle,
      value: !!metadata.ogTitle,
      message: metadata.ogTitle
        ? "Open Graph title is present"
        : "Open Graph title is missing",
    },
    ogDescriptionExists: {
      passed: !!metadata.ogDescription,
      value: !!metadata.ogDescription,
      message: metadata.ogDescription
        ? "Open Graph description is present"
        : "Open Graph description is missing",
    },
    twitterCardExists: {
      passed: !!metadata.twitterCard,
      value: !!metadata.twitterCard,
      message: metadata.twitterCard
        ? "Twitter card type is present"
        : "Twitter card type is missing",
    },
    twitterImageExists: {
      passed: !!metadata.twitterImage,
      value: !!metadata.twitterImage,
      message: metadata.twitterImage
        ? "Twitter image is present"
        : "Twitter image is missing",
    },
    keywordsPresent: {
      passed: !!metadata.keywords && metadata.keywords.length > 0,
      value: metadata.keywords?.length || 0,
      message: metadata.keywords && metadata.keywords.length > 0
        ? `${metadata.keywords.length} keywords present`
        : "Keywords are missing",
    },
    structuredDataExists: {
      passed: !!metadata.structuredData,
      value: !!metadata.structuredData,
      message: metadata.structuredData
        ? "Structured data (JSON-LD) is present"
        : "Structured data is missing - important for rich snippets",
    },
  };

  // Calculate score
  const totalChecks = Object.keys(checks).length;
  const passedChecks = Object.values(checks).filter((check) => check.passed).length;
  const score = Math.round((passedChecks / totalChecks) * 100);

  // Categorize issues
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  Object.entries(checks).forEach(([key, check]) => {
    if (!check.passed) {
      if (
        key === "titleLength" ||
        key === "metaDescriptionLength" ||
        key === "canonicalExists"
      ) {
        errors.push(`❌ ${check.message}`);
      } else if (
        key === "titleFormat" ||
        key === "ogImageExists" ||
        key === "structuredDataExists"
      ) {
        warnings.push(`⚠️ ${check.message}`);
      } else {
        suggestions.push(`💡 ${check.message}`);
      }
    }
  });

  return {
    isValid: score >= 80,
    score,
    checks,
    errors,
    warnings,
    suggestions,
  };
}

/**
 * Generate a human-readable report
 */
export function generateSEOReport(result: SEOValidationResult): string {
  const lines: string[] = [];

  lines.push("=".repeat(60));
  lines.push("SEO VALIDATION REPORT");
  lines.push("=".repeat(60));
  lines.push("");

  // Score
  const scoreEmoji = result.score >= 90 ? "🎉" : result.score >= 80 ? "✅" : result.score >= 60 ? "⚠️" : "❌";
  lines.push(`${scoreEmoji} Overall Score: ${result.score}/100`);
  lines.push(`Status: ${result.isValid ? "PASS" : "NEEDS IMPROVEMENT"}`);
  lines.push("");

  // Errors
  if (result.errors.length > 0) {
    lines.push("ERRORS (Must Fix):");
    result.errors.forEach((error) => lines.push(`  ${error}`));
    lines.push("");
  }

  // Warnings
  if (result.warnings.length > 0) {
    lines.push("WARNINGS (Should Fix):");
    result.warnings.forEach((warning) => lines.push(`  ${warning}`));
    lines.push("");
  }

  // Suggestions
  if (result.suggestions.length > 0) {
    lines.push("SUGGESTIONS (Nice to Have):");
    result.suggestions.forEach((suggestion) => lines.push(`  ${suggestion}`));
    lines.push("");
  }

  // Detailed checks
  lines.push("DETAILED CHECKS:");
  Object.entries(result.checks).forEach(([key, check]) => {
    const icon = check.passed ? "✅" : "❌";
    lines.push(`  ${icon} ${key}: ${check.message}`);
  });

  lines.push("");
  lines.push("=".repeat(60));

  return lines.join("\n");
}

/**
 * Quick validation helper for use in components
 */
export function quickValidate(metadata: SEOMetadata): {
  isValid: boolean;
  score: number;
  summary: string;
} {
  const result = validateTutorSEO(metadata);

  let summary = "";
  if (result.score >= 90) {
    summary = "Excellent SEO optimization!";
  } else if (result.score >= 80) {
    summary = "Good SEO, minor improvements possible";
  } else if (result.score >= 60) {
    summary = "Moderate SEO, several improvements needed";
  } else {
    summary = "Poor SEO, major improvements required";
  }

  return {
    isValid: result.isValid,
    score: result.score,
    summary,
  };
}
