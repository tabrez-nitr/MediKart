

 function getMedicines () {

    return  medicines = [
            // 🩺 General Medicine
            {
              id: 1,
              name: "Paracetamol",
              price: 100,
              description: "Reduces fever and relieves mild to moderate pain.",
              image: "../public/sampleImage.avif",
              category: "general"
            },
            {
              id: 2,
              name: "Ibuprofen",
              price: 120,
              description: "Pain reliever and anti-inflammatory medicine.",
              image: "../public/sampleImage.avif",
              category: "general"
            },
            {
              id: 3,
              name: "Cetirizine",
              price: 90,
              description: "Used to relieve allergy symptoms such as runny nose and sneezing.",
              image: "../public/sampleImage.avif",
              category: "general"
            },
          
            // 🦴 Orthopedic
            {
              id: 4,
              name: "Diclofenac",
              price: 150,
              description: "Relieves pain and inflammation in muscles and joints.",
              image: "../public/sampleImage.avif",
              category: "orthopedic"
            },
            {
              id: 5,
              name: "Calcium Carbonate",
              price: 200,
              description: "Supports bone health and prevents calcium deficiency.",
              image: "../public/sampleImage.avif",
              category: "orthopedic"
            },
            {
              id: 6,
              name: "Chondroitin Sulfate",
              price: 350,
              description: "Used to manage osteoarthritis and joint pain.",
              image: "../public/sampleImage.avif",
              category: "orthopedic"
            },
          
            // 🍽️ Gastroenterology
            {
              id: 7,
              name: "Omeprazole",
              price: 130,
              description: "Reduces stomach acid; used for acidity, reflux, and ulcers.",
              image: "../public/sampleImage.avif",
              category: "gastroenterology"
            },
            {
              id: 8,
              name: "Ranitidine",
              price: 110,
              description: "Used to treat heartburn and acid indigestion.",
              image: "../public/sampleImage.avif",
              category: "gastroenterology"
            },
            {
              id: 9,
              name: "Domperidone",
              price: 125,
              description: "Used to treat nausea, vomiting, and bloating.",
              image: "../public/sampleImage.avif",
              category: "gastroenterology"
            },
          
            // 🧫 Infectious Disease
            {
              id: 10,
              name: "Amoxicillin",
              price: 180,
              description: "Antibiotic used to treat bacterial infections.",
              image: "../public/sampleImage.avif",
              category: "infectious-disease"
            },
            {
              id: 11,
              name: "Azithromycin",
              price: 220,
              description: "Broad-spectrum antibiotic used for respiratory and skin infections.",
              image: "../public/sampleImage.avif",
              category: "infectious-disease"
            },
            {
              id: 12,
              name: "Metronidazole",
              price: 160,
              description: "Used to treat bacterial and parasitic infections.",
              image: "../public/sampleImage.avif",
              category: "infectious-disease"
            }
          ];
}

export default getMedicines;