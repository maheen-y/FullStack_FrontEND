var app = new Vue({
    el: "#app",
    data: {
        website: "After School Lessons & Activities",
        sortAttribute: "subject",
        sortOrder: "asc",
        showLessons: true,

        lessons: [],
            
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

    // Fetch function used to retrieve lessons from backend with GET request
    created(){
        fetch("http://localhost:3000/lessons")
        .then(function(res){
            return res.json();
        }).then(function(json){
            app.lessons = json;
        }).catch(function(error){
            console.log("Failed to retrieve lessons", error);
        });
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

        // Used to add lessons to basket 
        addLessonToBasket(lesson) {
            if (lesson.space_available > 0) {
                lesson.space_available--;
                this.basket.push(lesson);

                // Fetch function updates lesson availability with PUT request
                // Response in JSON format
                fetch("http://localhost:3000/lessons/" + lesson._id, {
                    method: "PUT", 
                    headers: {"Content-Type": "application/json"}, 
                    body: JSON.stringify({ space_available: lesson.space_available})
                }).then(function(res){
                    return res.json();
                }).then(function(json){
                    console.log("Lesson information has been updated", json);
                }).catch(function(error){
                    console.log("Unable to update lesson information, please try again", error);
                });
            }
        },   // ✅ FIXED: this bracket was missing!

        // Allows user to remove lesson from basket and changes availability accordingly
        removeLesson(index, lesson) {
            this.basket.splice(index, 1);
            lesson.space_available++;

            // Fetch updates lesson availability with PUT request
            fetch("http://localhost:3000/lessons/" + lesson._id, {
                method: "PUT", 
                headers: {"Content-Type": "application/json"}, 
                body: JSON.stringify({
                    space_available: lesson.space_available
                }) 
            }).then(function(res){
                return res.json();
            }).then(function(json){
                console.log("Lesson info updated successfully", json);
            }).catch(function(error){
                console.log("Unable to update lesson information", error);
            });
        },

        // Checks if form is valid, submits orders and displays confirmation message
        submitOrder() {
            if (this.isCheckoutFormValid) {
                const personalDataForOrder = {
                    firstName: this.order.firstName, 
                    surname: this.order.surname,
                    phone: this.order.phone,
                    address: this.order.address, 
                    city: this.order.city,
                    postcode: this.order.postcode,
                    email: this.order.email, 
                    lessons: this.basket.map(item => ({
                        id: item._id,
                        subject: item.subject
                    }))
                }; 

                // Use fetch function for POST request to save new order
                fetch("http://localhost:3000/orders", {
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json"
                    }, 
                    body: JSON.stringify(personalDataForOrder)
                }).then(function(res){
                    res.json().then(function(json){
                        console.log("Order successful", json);
                        alert("Your order has successfully been saved");
                    });
                }).catch(function(error){
                    console.log("Your order has not been saved, please try again", error);
                });

                this.orderConfirmationMessage = `Thank you, ${ this.order.firstName }! Your order has been submitted.`;
                
                this.order = {
                    firstName: "",
                    surname: "",
                    phone: "",
                    address: "",
                    city: "",
                    postcode: "",
                    email: ""
                };

                // Basket becomes empty after order placed
                this.basket = [];
                this.showLessons = false; // Keep user on checkout page to show message
               
            } else {
                // Displays error message if checkout form is incorrect
                this.orderConfirmationMessage = "Error occurred, please correct the form details.";
            }
        }
    }
});
