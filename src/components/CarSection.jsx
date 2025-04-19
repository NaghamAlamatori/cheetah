import React from "react";
import CarCard from "./CarCard";

function CarSection({ title, type }) {
  const cars = [
    {
      id: 1,
      name: "Mercedes-Benz S-Class",
      price: "$89,999",
      location: "New York",
      image:
        "https://images.unsplash.com/photo-1622200294772-e411743c0e07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80",
    },
    {
      id: 2,
      name: "BMW 7 Series",
      price: "$92,999",
      location: "Los Angeles",
      image:
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80",
    },
    {
      id: 3,
      name: "Audi A8",
      price: "$86,999",
      location: "Chicago",
      image:
        "https://images.unsplash.com/photo-1616422285623-13ff0162193c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80",
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CarSection;
