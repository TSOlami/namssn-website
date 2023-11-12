import { Image2, Image3, Image5, Image7, Teejay, DrStrange, Timi, Slimany, Ifedimeji, Team1, Team2, Team3, Team4, Team5, Team6, Team7, Team8, Team9, Team11, Team12, Team13, Team14, Team15 } from "../assets";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/blog", label: "Blog" },
  { href: "/departmental-fees", label: "Departmental Fees" },
  { href: "/events", label: "Events" },
  { href: "/#contact-us", label: "Contact Us" },
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

export const teamMembers = [
  {
		name: "Tijani Saheed Olalekan",
		role: "Project Manager & Backend Developer",
		image: Teejay,
		team: "Tech",
		facebook: "https://web.facebook.com/profile.php?id=100059079370738",
		linkedin: "https://linkedin.com/in/saheed-tijani-b9935625b",
    twitter: "https://twitter.com/def_input_name",
    github: "https://github.com/TSOlami/",
    website: "https://tsolami.github.io/",
  },
  {
		name: "Ifedolalapo Omoniyi",
		role: "Frontend Developer & Web Designer",
		image: DrStrange,
		team: "Tech",
		linkedin: "https://www.linkedin.com/in/ifedolapo-omoniyi/",
    twitter: "https://twitter.com/ife_ifedolapo",
    github: "https://github.com/ifedolapoomoniyi",
    website: "https://ifedolapo.netlify.app/",
  },
  {
    name: "Abdulkareem Abdulqudus",
    role: "Software Engineer",
    image: Slimany,
    team: "Tech",
    linkedin: "https://www.linkedin.com/in/slimany/",
    twitter: "https://twitter.com/Slimany_",
    github: "https://github.com",
    website: "https://slimany.netlify.app/",
  },
  {
		name: "Timilehin Olusa",
		role: "Backend Developer",
		image: Timi,
		team: "Tech",
		facebook: "https://web.facebook.com/100016232149332/",
		linkedin: "https://www.linkedin.com/in/timilehin-olusa-781386250/",
    twitter: "https://twitter.com/TimmieOlusa",
    github: "https://github.com",
    website: "https://timilehinolusa.netlify.app/",
  },
  {
    name: "Ifedimeji Omoniyi",
    role: "UI/UX Designer",
    image: Ifedimeji,
    team: "Tech",
    facebook: "https://web.facebook.com/",
    linkedin: "https://www.linkedin.com",
    twitter: "https://twitter.com/ifedimeji_",
    website: "https://ifedimeji.netlify.app/",
  },
  {
		name: "Oluwasegun Abraham Ajeolu",
		role: "President",
		image: Team14,
		team: "Executive",
		facebook: "https://web.facebook.com/",
		linkedin: "https://www.linkedin.com/in/abraham-oluwasegun?trk=contact-info",
    twitter: "https://twitter.com/",
  },
  {
		name: "Muhammad Rabbiat",
		role: "Vice President",
		image: Team9,
		team: "Executive",
		facebook: "https://web.facebook.com/",
		linkedin: "https://www.linkedin.com",
    twitter: "https://twitter.com/",
	},
  {
		name: "Onyilo Jonathan Ojila",
		role: "General Secretary",
		image: Team12,
		team: "Executive",
		facebook: "https://www.facebook.com/jonathan.onyilo.9",
		linkedin: "https://www.linkedin.com",
    twitter: "https://twitter.com/",
	},
  {
		name: "Benjamin Miracle C.",
		role: "Financial Secretary",
		image: Team7,
		team: "Executive",
		facebook: "https://web.facebook.com/",
		linkedin: "https://www.linkedin.com",
    twitter: "https://twitter.com/",
	},
  {
		name: "Obasi Goodness Chidera",
		role: "Treasurer",
		image: Team2,
		team: "Executive",
		facebook: "https://web.facebook.com/",
		linkedin: "https://www.linkedin.com",
    twitter: "https://twitter.com/",
	},
  {
		name: "Attaigu Peter Onimisi",
		role: "Director Of Research & Academics I",
		image: Team11,
		team: "Executive",
		facebook: "https://web.facebook.com/",
		linkedin: "https://www.linkedin.com/in/attaigu-peter-3157791ba?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    twitter: "https://twitter.com/",
	},
  {
		name: "Lamidi Bariu O.",
		role: "Director Of Research II",
		image: Team5,
		team: "Executive",
		facebook: "https://www.facebook.com/lamidi.bariuoj.plusmore?mibextid=ZbWKwL",
		linkedin: "https://www.linkedin.com",
    twitter: "https://www.twitter.com/@bariu_oj",
	},
  {
		name: "Ogunnusi Kolalwole Rapheal",
		role: "Director Of Socials",
		image: Team1,
		team: "Executive",
		facebook: "https://www.facebook.com/kolawole.ogunnusi.27?mibextid=2JQ9oc",
		linkedin: "https://www.linkedin.com",
    twitter: "https://twitter.com/",
	},
  {
		name: "Kayode Abdurasheed Olalekan",
		role: "Director Of Sports",
		image: Team6,
		team: "Executive",
		facebook: "https://www.facebook.com/KhayLhex?mibextid=LQQJ4d",
		linkedin: "https://www.linkedin.com",
    twitter: "https://twitter.com/",
	},
  {
		name: "Oloyede Gbenga Gabriel",
		role: "WelFare Director",
		image: Team3,
		team: "Executive",
		facebook: "https://www.facebook.com/kolawole.ogunnusi.27?mibextid=2JQ9oc",
		linkedin: "https://www.linkedin.com",
    twitter: "https://twitter.com/",
	},
  {
		name: "Ojile Joshua",
		role: "Auditor General",
		image: Team8,
		team: "Executive",
		facebook: "https://web.facebook.com/",
		linkedin: "https://www.linkedin.com",
    twitter: "https://twitter.com/",
	},
  
  {
		name: "Akanmoye Emeka Daniel",
		role: "PRO",
		image: Team4,
		team: "Executive",
		facebook: "https://www.facebook.com/profile.php?id=100091822404435",
		linkedin: "https://www.linkedin.com",
    twitter: "https://twitter.com/",
	},
  {
    name: "Prof Abdullah Idris Enagi",
    role: "HOD Mathematics",
    image: Team15,
    team: "Principal",
    facebook: "https://web.facebook.com/",
    linkedin: "https://www.linkedin.com",
    twitter: "https://twitter.com/",
  },
  {
		name: "Prof. Mohammed Jiya",
		role: "Staff Adviser",
		image: Team13,
		team: "Principal",
		facebook: "https://web.facebook.com/",
		linkedin: "https://www.linkedin.com",
    twitter: "https://twitter.com/",
  },
];
