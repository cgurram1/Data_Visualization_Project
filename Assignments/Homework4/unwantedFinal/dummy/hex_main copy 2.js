document.addEventListener("DOMContentLoaded", function () {
    const width = 800;
    const height = 750
    const hexRadius = 30;
    const hexMargin = 0;
  

    const data = [
        { name: "Lion" },
        { name: "Elephant" },
        { name: "Tiger" },
        { name: "Giraffe" },
        { name: "Zebra" },
        { name: "Kangaroo" },
        { name: "Panda" },
        { name: "Dolphin" },
        { name: "Hippopotamus" },
        { name: "Koala" },
        { name: "Rhinoceros" },
        { name: "Penguin" },
        { name: "Leopard" },
        { name: "Gorilla" },
        { name: "Ostrich" },
        { name: "Polar Bear" },
        { name: "Cheetah" },
        { name: "Peacock" },
        { name: "Chimpanzee" },
        { name: "Octopus" },
        { name: "Sloth" },
        { name: "Crocodile" },
        { name: "Meerkat" },
        { name: "Hedgehog" },
        { name: "Flamingo" },
        { name: "Pangolin" },
        { name: "Squirrel" },
        { name: "Raccoon" },
        { name: "Puma" },
        { name: "Otter" },
        { name: "Lemur" },
        { name: "Manatee" },
        { name: "Armadillo" },
        { name: "Kookaburra" },
        { name: "Jaguar" },
        { name: "Walrus" },
        { name: "Gazelle" },
        { name: "Hare" },
        { name: "Seahorse" },
        { name: "Platypus" },
        { name: "Salamander" },
        { name: "Llama" },
        { name: "Fennec Fox" },
        { name: "Gibbon" },
        { name: "Pigeon" },
        { name: "Quokka" },
        { name: "Narwhal" },
        { name: "Alpaca" },
        { name: "Capybara" },
        { name: "Koala" },
        { name: "Red Panda" },
        { name: "Eagle" },
        { name: "Polar Bear" },
        { name: "Cheetah" },
        { name: "Puma" },
        { name: "Hedgehog" },
        { name: "Platypus" },
        { name: "Gazelle" },
        { name: "Fennec Fox" },
        { name: "Gibbon" },
        { name: "Pigeon" },
        { name: "Quokka" },
        { name: "Narwhal" },
        { name: "Alpaca" },
        { name: "Capybara" },
        { name: "Koala" },
        { name: "Red Panda" },
        { name: "Eagle" },
        { name: "Polar Bear" },
        { name: "Cheetah" },
        { name: "Puma" },
        { name: "Hedgehog" },
        { name: "Platypus" },
        { name: "Gazelle" },
        { name: "Fennec Fox" },
        { name: "Gibbon" },
        { name: "Pigeon" },
        { name: "Quokka" },
        { name: "Narwhal" },
        { name: "Alpaca" },
        { name: "Capybara" },
        { name: "Koala" },
        { name: "Red Panda" },
        { name: "Eagle" },
        { name: "Polar Bear" },
        { name: "Cheetah" },
        { name: "Puma" },
        { name: "Hedgehog" },
        { name: "Platypus" },
        { name: "Gazelle" },
        { name: "Fennec Fox" },
        { name: "Gibbon" },
        { name: "Pigeon" },
        { name: "Quokka" },
        { name: "Narwhal" },
        { name: "Alpaca" },
        { name: "Capybara" },
        { name: "Koala" },
        { name: "Red Panda" },
        { name: "Eagle" },
        { name: "Polar Bear" },
        { name: "Cheetah" },
        { name: "Puma" },
        { name: "Hedgehog" },
        { name: "Platypus" },
        { name: "Gazelle" },
        { name: "Fennec Fox" },
        { name: "Gibbon" },
        { name: "Pigeon" },
        { name: "Quokka" },
        { name: "Narwhal" },
        { name: "Alpaca" },
        { name: "Capybara" },
        { name: "Koala" },
        { name: "Red Panda" },
        { name: "Eagle" },
        { name: "Polar Bear" },
        { name: "Cheetah" },
        { name: "Puma" },
        { name: "Hedgehog" },
        { name: "Platypus" },
        { name: "Gazelle" },
        { name: "Fennec Fox" },
        { name: "Gibbon" },
        { name: "Pigeon" },
        { name: "Quokka" },
        { name: "Narwhal" },
        { name: "Alpaca" },
        { name: "Capybara" },
        { name: "Koala" },
        { name: "Red Panda" },
        { name: "Eagle" },
        { name: "Polar Bear" },
        { name: "Cheetah" },
        { name: "Puma" },
        { name: "Hedgehog" },
        { name: "Platypus" },
        { name: "Gazelle" },
        { name: "Fennec Fox" },
        { name: "Gibbon" },
        { name: "Pigeon" },
        { name: "Quokka" },
        { name: "Narwhal" },
        { name: "Alpaca" },
        { name: "Capybara" },
        { name: "Koala" },
        { name: "Red Panda" },
        { name: "Eagle" },
        { name: "Polar Bear" },
        { name: "Cheetah" },
        { name: "Puma" },
        { name: "Hedgehog" },
        { name: "Platypus" },
        { name: "Gazelle" },
        { name: "Fennec Fox" },
        { name: "Gibbon" },
        { name: "Pigeon" },
        { name: "Quokka" },
        { name: "Narwhal" },
        { name: "Alpaca" },
        { name: "Capybara" },
        { name: "Koala" },
        { name: "Red Panda" },
        { name: "Eagle" },
        { name: "Polar Bear" },
        { name: "Cheetah" },
        { name: "Puma" },
        { name: "Hedgehog" },
        { name: "Platypus" },
        { name: "Gazelle" },
        { name: "Fennec Fox" },
        { name: "Gibbon" },
        { name: "Pigeon" },
        { name: "Quokka" },
        { name: "Narwhal" },
        { name: "Alpaca" },
        { name: "Lion" },
        { name: "Elephant" },
        { name: "Tiger" },
        { name: "Giraffe" },
        { name: "Zebra" },
        { name: "Kangaroo" },
        { name: "Panda" },
        { name: "Dolphin" },
        { name: "Hippopotamus" },
        { name: "Koala" },
        { name: "Rhinoceros" },
        { name: "Penguin" },
        { name: "Leopard" },
        { name: "Gorilla" },
        { name: "Ostrich" },
        { name: "Polar Bear" },
        { name: "Cheetah" },
        { name: "Peacock" },
        { name: "Chimpanzee" },
        { name: "Octopus" },
        { name: "Sloth" },
        { name: "Crocodile" },
        { name: "Meerkat" },
        { name: "Hedgehog" },
        { name: "Flamingo" },
        { name: "Pangolin" },
        { name: "Squirrel" },
        { name: "Raccoon" },
        { name: "Puma" },
        { name: "Otter" },
        { name: "Lemur" },
        { name: "Manatee" },
        { name: "Armadillo" },
        { name: "Kookaburra" },
        { name: "Jaguar" },
        { name: "Walrus" },
        { name: "Gazelle" },
        { name: "Hare" },
        { name: "Seahorse" },
        { name: "Platypus" },
        { name: "Salamander" },
        { name: "Llama" },
        { name: "Fennec Fox" },
        { name: "Gibbon" },
        { name: "Pigeon" },
        { name: "Quokka" },
        { name: "Narwhal" },
        { name: "Alpaca" },
        { name: "Capybara" },
        { name: "Koala" },
        { name: "Red Panda" },
        { name: "Eagle" },
        { name: "Polar Bear" },
        { name: "Cheetah" },
        { name: "Puma" },
        { name: "Hedgehog" },
        { name: "Platypus" },
        { name: "Gazelle" },
        { name: "Fennec Fox" },
        { name: "Gibbon" },
        { name: "Pigeon" },
        { name: "Quokka" },
        { name: "Narwhal" },
        { name: "Alpaca" },
        { name: "Capybara" },
        { name: "Koala" },
        { name: "Red Panda" },
        { name: "Eagle" },
        { name: "Polar Bear" },
        { name: "Cheetah" },
        { name: "Puma" },
        { name: "Hedgehog" },
        { name: "Platypus" },
        { name: "Gazelle" },
        { name: "Fennec Fox" },
        { name: "Gibbon" },
        { name: "Pigeon" },
        { name: "Quokka" },
        { name: "Narwhal" },
        { name: "Alpaca" },
        { name: "Capybara" },
        { name: "Koala" },
        { name: "Red Panda" },
        { name: "Eagle" },
        { name: "Polar Bear" },
        { name: "Cheetah" },
        { name: "Puma" },
        { name: "Hedgehog" },
        { name: "Platypus" },
        { name: "Gazelle" },
        { name: "Fennec Fox" },
        { name: "Gibbon" },
        { name: "Pigeon" },
        { name: "Quokka" },
        { name: "Narwhal" },
        { name: "Alpaca" },
        { name: "Capybara" },
        { name: "Koala" },
        { name: "Red Panda" },
        { name: "Eagle" },
        { name: "Polar Bear" },
        { name: "Cheetah" },
        { name: "Puma" },
        { name: "Hedgehog" },
        { name: "Platypus" },
        { name: "Gazelle" },
        { name: "Fennec Fox" },
        { name: "Gibbon" },
        { name: "Pigeon" },
        { name: "Quokka" },
        { name: "Narwhal" },
        { name: "Alpaca" },
        { name: "Capybara" },
        { name: "Koala" },
        { name: "Red Panda" },
        { name: "Eagle" },
        { name: "Polar Bear" },
        { name: "Cheetah" },
        { name: "Puma" },
        { name: "Hedgehog" },
        { name: "Platypus" },
        { name: "Gazelle" },
        { name: "Fennec Fox" },
        { name: "Gibbon" },
        { name: "Pigeon" },
        { name: "Quokka" },
        { name: "Narwhal" },
        { name: "Alpaca" },
        { name: "Capybara" },
        { name: "Koala" },
        { name: "Red Panda" },
        { name: "Eagle" }
      
      ];
      console.log(data.length)

      

const hexWidth = Math.sqrt(3) * hexRadius + hexMargin;
const hexHeight = 2 * hexRadius + hexMargin * 2;


const svg = d3.select('#hexgrid-container')
  .append('svg')
  .attr('width', width)
  .attr('height', height);


const hexLayout = d3.hexbin()
  .x(d => d[0])
  .y(d => d[1])
  .radius(hexRadius);


const hexagons = svg.append("g")
  .selectAll('.hexagon')
  .data(hexLayout(data.map((d, i) => [
    (i % (Math.floor(width / hexWidth)) * hexWidth) + (Math.floor(i / (height / hexHeight)) % 2 === 0 ? hexWidth / 2 : 0),
    (Math.floor(i / (height / hexHeight)) * hexHeight)
  ])))
  .enter()
  .append('path')
  .attr('class', 'hexagon')
  .attr('d', d => hexLayout.hexagon(hexRadius))
  .attr('transform', d => `translate(${d.x},${d.y})`)
  .on('mouseover', function (d) {
    
    const animalName = data[d.i].name;
    
    console.log(`Animal: ${animalName}`);
  });


hexagons
  .attr('fill', 'lightblue')
  .attr('stroke', 'white')
  .attr('stroke-width', 1);
});      
  