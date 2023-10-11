import { Image2, Image3, Image5, Image7 } from "../assets";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/departmental-fees", label: "Departmental Fees" },
  { href: "/events", label: "Events" },
  { href: "/contact-us", label: "Contact Us" },
];

export const blogPosts = [
  {
    id: 1,
    title: "The revolution of mathematics and its forerunners",
    body: "There is debate over whether mathematical objects such as numbers and points exist naturally or are human creations. The mathematician Benjamin Peirce called mathematics the science that draws necessary conclusions. Albert Einstein, on the other hand, stated that as far as the laws of mathematics refer to reality, they are not certain; and as far as they are certain, they do not refer to reality. Through abstraction and logical reasoning mathematics evolved from counting, calculation, measurement, and the systematic study of the shapes and motions of physical objects. Practical mathematics has been a human activity for as far back as written records exist. Rigorous arguments first appeared in Greek mathematics, most notably in Euclids Elements. Mathematics continued to develop, in fitful bursts, until the Renaissance, when mathematical innovations interacted with new scientific discoveries, leadin...... read more",
    image: Image2,
    tags: ["Evolution", "Mathematics", "Aristotle"],
    date: "September 1, 2023",
    author: "John Doe",
    upvotes: 10,
    downvotes: 2,
    comments: [
      {
        id: 1,
        user: "Alice",
        comment: "Great post!",
      },
      {
        id: 2,
        user: "Bob",
        comment: "I enjoyed reading this.",
      },
    ],
  },
  {
    id: 2,
    title: "The revolution of mathematics and its forerunners",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla non massa augue. Nulla id purus eget erat euismod blandit. Fusce ac orci at ex venenatis pulvinar a sit amet sem. Proin bibendum varius hendrerit. Donec efficitur ipsum at viverra. Fusce consectetur, elit nec facilisis suscipit, lectus ipsum congue justo, vel bibendum purus sem a orci.",
    image: Image3,
    tags: ["Lorem", "Ipsum", "Dolor"],
    date: "September 5, 2023",
    author: "Jane Smith",
    upvotes: 15,
    downvotes: 3,
    comments: [
      {
        id: 1,
        user: "Eve",
        comment: "Interesting article!",
      },
      {
        id: 2,
        user: "Charlie",
        comment: "Well written.",
      },
    ],
  },
  {
    id: 3,
    title: "The revolution of mathematics and its forerunners",
    body: "Sed euismod eget dui eu hendrerit. In interdum nec lorem nec elementum. Sed facilisis, tortor at vestibulum hendrerit, lectus massa scelerisque nunc, nec condimentum dui dolor ut turpis. Sed mattis augue nec felis mattis, eu efficitur felis euismod. Donec at tortor sit amet justo ullamcorper tristique.",
    image: Image5,
    tags: ["Sed", "Euismod", "Dui"],
    date: "September 10, 2023",
    author: "Michael Johnson",
    upvotes: 20,
    downvotes: 1,
    comments: [
      {
        id: 1,
        user: "Grace",
        comment: "I learned something new!",
      },
      {
        id: 2,
        user: "David",
        comment: "Impressive!",
      },
    ],
  },
  {
    id: 4,
    title: "The revolution of mathematics and its forerunners",
    body: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras tincidunt, metus in cursus efficitur, mi ligula lacinia odio, id lacinia lorem elit ut erat. Ut ullamcorper auctor quam non laoreet. Praesent vitae justo et sem porttitor placerat. Fusce vel neque eu lectus aliquam gravida nec a dui. Sed consectetur, orci non iaculis auctor, lectus velit facilisis metus, eu cursus quam est id sem.",
    image: Image7,
    tags: ["Pellentesque", "Habitant", "Morbi"],
    date: "September 15, 2023",
    author: "Sarah Brown",
    upvotes: 12,
    downvotes: 5,
    comments: [
      {
        id: 1,
        user: "Oliver",
        comment: "Great insights!",
      },
      {
        id: 2,
        user: "Sophia",
        comment: "I enjoyed this article.",
      },
    ],
  }
];
