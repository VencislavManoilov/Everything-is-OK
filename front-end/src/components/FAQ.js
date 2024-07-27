import React from 'react';

const faqData = [
    {
        question: "Why should I not be afraid of flying?",
        answer: "Flying is one of the safest modes of transportation. Statistically, the chances of being involved in an accident are extremely low compared to other forms of travel like driving."
    },
    {
        question: "Why is public speaking not as scary as it seems?",
        answer: "Most people feel nervous about public speaking, but remember that the audience is generally supportive and wants you to succeed. Practicing and preparing can also significantly reduce anxiety."
    },
    {
        question: "Why should I not worry about the future?",
        answer: "Worrying about the future often stems from uncertainty. Focusing on the present and taking proactive steps to prepare can help alleviate these fears. Remember, you have control over your actions and decisions."
    },
    {
        question: "Why is it okay to make mistakes?",
        answer: "Mistakes are a natural part of learning and growing. They provide valuable lessons and opportunities for improvement. Everyone makes mistakes, and it's important to be kind to yourself and view them as part of the journey."
    },
    {
        question: "Why is it okay to be afraid of change?",
        answer: "Change is a natural part of life and can lead to personal growth and new opportunities. Feeling afraid of change is normal, but embracing it can open up new possibilities and experiences that you may not have imagined."
    },
    {
        question: "Why should I not be afraid of failure?",
        answer: "Failure is a stepping stone to success. It provides valuable lessons and insights that contribute to personal and professional growth. Many successful people have experienced failures before achieving their goals."
    }
];  

const FAQ = () => {
    return (
        <div className="container mt-5">
            <h2 className="mb-4">Frequently Asked Questions</h2>
            
            <div className="accordion" id="accordionExample">
                {faqData.map((faq, index) => (
                    <div key={index} className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="false" aria-controls={`collapse${index}`}>
                                { faq.question }
                            </button>
                        </h2>
                        <div id={`collapse${index}`} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                            <div className="accordion-body text-start">
                                { faq.answer }
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;