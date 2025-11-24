new Vue({
    el: "#app",
    data: {
        website: "After School Lessons & Activities",
        sortAttribute: "subject",
        sortOrder: "asc",
        showLessons: true,

        lessons: [
            {
                ID: 1,
                subject: "English",
                location: "Barnet",
                price: 40,
                space_available: 5,
                image: "./images/english.jpg"
            },
            {
                ID: 2,
                subject: "Maths",
                location: "Edgware",
                price: 50,
                space_available: 5,
                image: "./images/math.jpg"
            },
            {
                ID: 3,
                subject: "Biology",
                location: "Finchley",
                price: 45,
                space_available: 5,
                image: "./images/biology.jpg"
            },
            {
                ID: 4,
                subject: "Chemistry",
                location: "Harrow",
                price: 55,
                space_available: 5,
                image: "./images/chemistry.jpg"
            },
            {
                ID: 5,
                subject: "Physics",
                location: "Hendon",
                price: 60,
                space_available: 5,
                image: "./images/physics.jpg"
            },
            {
                ID: 6,
                subject: "Geography",
                location: "Westminster",
                price: 70,
                space_available: 5,
                image: "./images/geography.jpg"
            },
            {
                ID: 7,
                subject: "Computing",
                location: "Kilburn",
                price: 65,
                space_available: 5,
                image: "./images/computing.png"
            },
            {
                ID: 8,
                subject: "French",
                location: "Battersea",
                price: 40,
                space_available: 5,
                image: "./images/french.png"
            },
            {
                ID: 9,
                subject: "Spanish",
                location: "Mile End",
                price: 45,
                space_available: 5,
                image: "./images/spanish.jpg"
            },
            {
                ID: 10,
                subject: "Physical Education",
                location: "East Ham",
                price: 35,
                space_available: 5,
                image: "./images/PE.jpg"
            }
        ],

        // Lessons added to basket are stored in array
        basket: [],

        // Javascript object to store customers personal information
        order: {
            firstName: "",
            surname: "",
            phone: "",
            address: "",
            city: "",
            postcode: "",
            email: ""
        },

        // Message displayed to confirm the order placed
        orderConfirmationMessage: ""
    },

    computed: {
        // Shows number of lessons added to basket
        lessonsInBasket() {
            return this.basket.length;
        },

        // Regular expressions used to check if name and phone are valid
        isCheckoutFormValid() {
            const nameCheck = /^[a-zA-Z ]+$/;
            const phoneCheck = /^[0-9]+$/;

            return (
                nameCheck.test(this.order.firstName) &&
                nameCheck.test(this.order.surname) &&
                phoneCheck.test(this.order.phone) &&
                this.order.address.trim() &&
                this.order.city.trim() &&
                this.order.postcode.trim() &&
                this.order.email.includes("@")
            );
        },

        // Used to display sorted lessons in terms of ascending/descending order for the attribute selected
        sortedLessons() {
            return this.lessons.slice().sort((a, b) => {
                let valA = a[this.sortAttribute];
                let valB = b[this.sortAttribute];

                if (typeof valA === "string") valA = valA.toLowerCase();
                if (typeof valB === "string") valB = valB.toLowerCase();

                if (this.sortOrder === "asc") {
                    return valA > valB ? 1 : valA < valB ? -1 : 0;
                } else {
                    return valA < valB ? 1 : valA > valB ? -1 : 0;
                }
            });
        }
    },

    methods: {
        // Allows user to switch between the lessons and checkout page
        displayCheckout() {
            this.showLessons = !this.showLessons;
            this.orderConfirmationMessage = ""; // Clear message when switching pages
        },

        // Used to add lessons to basket and change availability
        addLessonToBasket(lesson) {
            if (lesson.space_available > 0) {
                lesson.space_available--;
                this.basket.push(lesson);
            }
        },

        // Allows user to remove lesson from basket and changes availability accordingly
        removeLesson(index, lesson) {
            this.basket.splice(index, 1);
            lesson.space_available++;
        },

        // Checks if form is valid, submits orders and displays confirmation message
        submitOrder() {
            if (this.isCheckoutFormValid) {
                this.orderConfirmationMessage = `Thank you, ${this.order.firstName}! Your order has been submitted.`;
                this.order = {
                    firstName: "",
                    surname: "",
                    phone: "",
                    address: "",
                    city: "",
                    postcode: "",
                    email: ""
                };

                //Basket becomes empty after order placed
                this.basket = [];
                this.showLessons = false; // Keep user on checkout page to show message
               
                // Displays error message if checkout form is incorrect
            } else {
                this.orderConfirmationMessage = "Error occurred, please correct the form details.";
            }
        }
    }
});



