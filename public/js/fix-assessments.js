export async function getAllAssessmentsEntries() {
    try {
      const response = await fetch('/api/all/assessments/entries'); // Adjust the URL if necessary
      if (!response.ok) {
        throw new Error(`Error fetching assessments: ${response.statusText}`);
      }
      const assessments = await response.json();
      return assessments;
    } catch (error) {
      console.error('Failed to retrieve assessments:', error);
      return [];
    }
  }
