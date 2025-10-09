

 function getMedicines () {

     const medicine =   [
            // 🩺 General Medicine
            
              // 💊 General
              {
                id: 1,
                name: "Paracetamol",
                price: 100,
                description: "Reduces fever and relieves mild to moderate pain.",
                image: "/sampleImage.avif",
                category: "general",
                details: "100mg, 120 tablets"
              },
              {
                id: 2,
                name: "Ibuprofen",
                price: 120,
                description: "Pain reliever and anti-inflammatory medicine.",
                image: "/sampleImage.avif",
                category: "general",
                details: "200mg, 100 tablets"
              },
              {
                id: 3,
                name: "Cetirizine",
                price: 90,
                description: "Used to relieve allergy symptoms such as runny nose and sneezing.",
                image: "/sampleImage.avif",
                category: "general",
                details: "10mg, 90 tablets"
              },
            
              // 🦴 Orthopedic
              {
                id: 4,
                name: "Diclofenac",
                price: 150,
                description: "Relieves pain and inflammation in muscles and joints.",
                image: "/sampleImage.avif",
                category: "orthopedic",
                details: "50mg, 150 tablets"
              },
              {
                id: 5,
                name: "Calcium Carbonate",
                price: 200,
                description: "Supports bone health and prevents calcium deficiency.",
                image: "/sampleImage.avif",
                category: "orthopedic",
                details: "500mg, 60 tablets"
              },
              {
                id: 6,
                name: "Chondroitin Sulfate",
                price: 350,
                description: "Used to manage osteoarthritis and joint pain.",
                image: "/sampleImage.avif",
                category: "orthopedic",
                details: "400mg, 90 tablets"
              },
            
              // 🍽️ Gastroenterology
              {
                id: 7,
                name: "Omeprazole",
                price: 130,
                description: "Reduces stomach acid; used for acidity, reflux, and ulcers.",
                image: "/sampleImage.avif",
                category: "gastroenterology",
                details: "20mg, 100 tablets"
              },
              {
                id: 8,
                name: "Ranitidine",
                price: 110,
                description: "Used to treat heartburn and acid indigestion.",
                image: "/sampleImage.avif",
                category: "gastroenterology",
                details: "150mg, 80 tablets"
              },
              {
                id: 9,
                name: "Domperidone",
                price: 125,
                description: "Used to treat nausea, vomiting, and bloating.",
                image: "/sampleImage.avif",
                category: "gastroenterology",
                details: "10mg, 120 tablets"
              },
            
              // 🧫 Infectious Disease
              {
                id: 10,
                name: "Amoxicillin",
                price: 180,
                description: "Antibiotic used to treat bacterial infections.",
                image: "/sampleImage.avif",
                category: "infectious-disease",
                details: "250mg, 60 tablets"
              },
              {
                id: 11,
                name: "Azithromycin",
                price: 220,
                description: "Broad-spectrum antibiotic used for respiratory and skin infections.",
                image: "/sampleImage.avif",
                category: "infectious-disease",
                details: "500mg, 30 tablets"
              },
              {
                id: 12,
                name: "Metronidazole",
                price: 160,
                description: "Used to treat bacterial and parasitic infections.",
                image: "/sampleImage.avif",
                category: "infectious-disease",
                details: "400mg, 90 tablets"
              }
            
          ];
          return medicine
}

export default getMedicines;