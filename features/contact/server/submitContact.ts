export type ContactSubmissionInput = {
  email: string;
  message: string;
};

export async function submitContact(input: ContactSubmissionInput): Promise<void> {
  void input;
}