
/**
 * @deprecated This file is kept for backward compatibility.
 * Please use the new services: apiService, githubService, and linkedinService.
 */

import apiService, { ProfileData } from './apiService';

// Re-export the ProfileData interface for backward compatibility
export type { ProfileData };

// Legacy getProfile function that uses the new apiService
export const getProfile = async (): Promise<ProfileData> => {
  try {
    return await apiService.getProfile();
  } catch (error) {
    console.error('Error fetching profile data:', error);
    // Return mock data as fallback
    return {
      profile: {
        name: "Diwas Kunwar",
        headline: "ML Engineer",
        location: "",
        industry: "Computer Software",
        summary: "With a solid foundation in Python programming and extensive experience in backend development using Django and Flask/FastAPI, I specialize in turning intricate data into actionable insights and robust applications. My expertise spans from gathering web data using Beautiful Soup and Selenium to analyzing it with pandas and NumPy, crafting compelling narratives through data visualization tools like Plotly and Seaborn.\n\nI'm particularly proud of my recent ventures into blog generation app using gemini, analyzing stock market trends, developing a Document Chatbot for text extraction, or refining data for clearer insights, each project enhances my resolve to make a difference in the tech world. I thrive in environments where innovation meets impact, and I'm eager to contribute my skills to projects that align with my passion for technology.\n\nLet's connect and explore how we can collaborate to drive innovation and create lasting value through tech! 📈",
        picture: "",
        publicIdentifier: "diwas-kunwar",
        address: "",
        birthDate: {},
        Urls:[
          {"name":"LinkedIn","url":"https://www.linkedin.com/in/diwas-kunwar"},
          {"name":"GitHub","url":"https://github.com/diwaskunwar"},
          {"name":"Website","url":"https://diwas-kunwar.com.np"},
          {"name":"Email","url":"mailto:diwas.kuwar@gmail.com"},
          {"name":"Hugging Face","url":"https://huggingface.co/diwas-kunwar"},
          {"name":"Phone","url":"tel:+9779841000000"}
        ]
      }
    };
  }
};

// Legacy profileService object that uses the new apiService
export const profileService = {
  getProfile
};

export default profileService;
