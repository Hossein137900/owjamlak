// Input validation utilities
export const validateObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, "_");
};

export const validateImageFile = (
  file: File
): { valid: boolean; error?: string } => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  const maxSize = 10 * 1024 * 1024; // 30MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "نوع فایل تصویر نامعتبر است" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "حجم فایل تصویر بیش از حد مجاز است" };
  }

  return { valid: true };
};

export const validateVideoFile = (
  file: File
): { valid: boolean; error?: string } => {
  const allowedTypes = [
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/avi",
    "video/mov",
  ];
  const maxSize = 10 * 1024 * 1024; // 100MB

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "نوع فایل ویدیو نامعتبر است" };
  }

  if (file.size > maxSize) {
    return { valid: false, error: "حجم فایل ویدیو بیش از حد مجاز است" };
  }

  return { valid: true };
};

export const validateUserId = (userId: string): boolean => {
  return /^[a-zA-Z0-9_-]+$/.test(userId) && userId.length <= 50;
};

export const sanitizeInput = (input: string): string => {
  return input.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );
};
