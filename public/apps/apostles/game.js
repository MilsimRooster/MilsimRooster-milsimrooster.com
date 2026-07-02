const apostles = [
  {
    name: "Peter",
    also: "Simon Peter, Cephas",
    symbol: "Keys",
    image: "assets/apostle-peter-storybook.webp",
    color: "#226d73",
    reference: "Matthew 16:18-19",
    fact: "He confessed that Jesus is the Christ and became a leading voice among the apostles.",
    lesson: "Courage can grow after failure when we return to Jesus.",
    clue: "Jesus called him a rock, and he denied Jesus before being restored."
  },
  {
    name: "Andrew",
    also: "Peter's brother",
    symbol: "Net",
    image: "assets/apostle-andrew-storybook.webp",
    color: "#697a37",
    reference: "John 1:40-42",
    fact: "He brought his brother Simon Peter to Jesus.",
    lesson: "One invitation can change a life.",
    clue: "He introduced his brother Peter to Jesus."
  },
  {
    name: "James",
    also: "Son of Zebedee",
    symbol: "Thunder",
    image: "assets/apostle-james-storybook.webp",
    color: "#7b2d45",
    reference: "Mark 3:17",
    fact: "He and John were called Sons of Thunder.",
    lesson: "Jesus can shape strong personalities for holy purpose.",
    clue: "He was John's brother and one of the Sons of Thunder."
  },
  {
    name: "John",
    also: "Son of Zebedee",
    symbol: "Scroll",
    image: "assets/apostle-john-storybook.webp",
    color: "#284b7a",
    reference: "John 19:26-27",
    fact: "Jesus entrusted Mary to his care at the cross.",
    lesson: "Love shows up with faithfulness.",
    clue: "Many Christians connect him with the Gospel of John."
  },
  {
    name: "Philip",
    also: "From Bethsaida",
    symbol: "Loaves",
    image: "assets/apostle-philip-storybook.webp",
    color: "#b7791f",
    reference: "John 6:5-7",
    fact: "Jesus tested him before feeding the five thousand.",
    lesson: "Jesus is not limited by what we can count.",
    clue: "Jesus asked him where to buy bread for the crowd."
  },
  {
    name: "Bartholomew",
    also: "Often linked with Nathanael",
    symbol: "Fig Tree",
    image: "assets/apostle-bartholomew-storybook.webp",
    color: "#2f855a",
    reference: "John 1:47-49",
    fact: "Jesus described Nathanael as an honest man.",
    lesson: "God sees honest hearts.",
    clue: "Often linked with Nathanael, who sat under a fig tree."
  },
  {
    name: "Thomas",
    also: "Didymus",
    symbol: "Spear",
    image: "assets/apostle-thomas-storybook.webp",
    color: "#5a4a8f",
    reference: "John 20:24-29",
    fact: "He wanted to see Jesus' wounds and then confessed, 'My Lord and my God.'",
    lesson: "Bring honest questions to Jesus.",
    clue: "He is remembered for doubting, then believing."
  },
  {
    name: "Matthew",
    also: "Levi",
    symbol: "Coins",
    image: "assets/apostle-matthew-storybook.webp",
    color: "#8a4f2b",
    reference: "Matthew 9:9",
    fact: "He was a tax collector when Jesus called him.",
    lesson: "No past is too messy for Jesus' call.",
    clue: "He left the tax booth to follow Jesus."
  },
  {
    name: "James the Less",
    also: "Son of Alphaeus",
    symbol: "Lamp",
    image: "assets/apostle-james-the-less-storybook.webp",
    color: "#805ad5",
    reference: "Matthew 10:3",
    fact: "He is listed among the Twelve as James son of Alphaeus.",
    lesson: "Faithfulness matters even when the spotlight is small.",
    clue: "He is the other James among the Twelve."
  },
  {
    name: "Thaddaeus",
    also: "Judas son of James, Jude",
    symbol: "Heart",
    image: "assets/apostle-thaddaeus-storybook.webp",
    color: "#b83280",
    reference: "John 14:22",
    fact: "He asked Jesus why He would reveal Himself to the disciples and not the world.",
    lesson: "Good questions can open deeper teaching.",
    clue: "Also called Judas son of James, but not Iscariot."
  },
  {
    name: "Simon the Zealot",
    also: "Simon the Cananaean",
    symbol: "Flame",
    image: "assets/apostle-simon-the-zealot-storybook.webp",
    color: "#c53030",
    reference: "Luke 6:15",
    fact: "His title suggests passionate commitment before following Jesus.",
    lesson: "Jesus redirects zeal into kingdom love.",
    clue: "His name includes a title that means passionate or zealous."
  },
  {
    name: "Judas Iscariot",
    also: "The betrayer",
    symbol: "Purse",
    image: "assets/apostle-judas-iscariot-storybook.webp",
    color: "#4a5568",
    reference: "Matthew 26:14-16",
    fact: "He betrayed Jesus, and his story warns against divided loyalty.",
    lesson: "Being near holy things is not the same as a surrendered heart.",
    clue: "He betrayed Jesus for silver."
  },
  {
    name: "Matthias",
    also: "Chosen after Judas",
    symbol: "Lot",
    image: "assets/apostle-matthias-storybook.webp",
    color: "#3182ce",
    reference: "Acts 1:23-26",
    fact: "He was chosen to take Judas Iscariot's place after the resurrection.",
    lesson: "God continues His mission through faithful witnesses.",
    clue: "He was selected in Acts to replace Judas Iscariot."
  },
  {
    name: "Paul",
    also: "Saul of Tarsus",
    symbol: "Road",
    image: "assets/apostle-paul-storybook.webp",
    color: "#2c7a7b",
    reference: "Acts 9:1-19",
    fact: "The risen Jesus met him on the road to Damascus.",
    lesson: "Jesus can transform even an enemy into a witness.",
    clue: "He met Jesus on the road to Damascus."
  }
];

const extraFigures = [
  {
    name: "Joseph called Barsabbas",
    also: "Candidate with Matthias",
    symbol: "Lot",
    color: "#7a5a2f",
    reference: "Acts 1:23",
    fact: "He was one of the two men named before Matthias was chosen.",
    lesson: "Faithfulness still matters when another person is selected.",
    clue: "He was considered with Matthias in Acts 1."
  },
  {
    name: "Barnabas",
    also: "Son of encouragement",
    symbol: "Cloak",
    color: "#5f7d3b",
    reference: "Acts 4:36-37",
    fact: "He encouraged believers and helped welcome Paul.",
    lesson: "Encouragement can open doors for others.",
    clue: "He traveled with Paul and was known for encouragement."
  },
  {
    name: "Silas",
    also: "Mission companion",
    symbol: "Song",
    color: "#3d6f86",
    reference: "Acts 16:25",
    fact: "He prayed and sang with Paul in prison.",
    lesson: "Worship can continue even in hard places.",
    clue: "He joined Paul on missionary journeys."
  },
  {
    name: "Timothy",
    also: "Young coworker",
    symbol: "Letter",
    color: "#7b5a8f",
    reference: "2 Timothy 1:5",
    fact: "He learned sincere faith and served alongside Paul.",
    lesson: "Young believers can serve with courage.",
    clue: "Paul wrote letters to him."
  },
  {
    name: "Stephen",
    also: "Early witness",
    symbol: "Crown",
    color: "#8a6a2a",
    reference: "Acts 6-7",
    fact: "He served the church and spoke boldly about Jesus.",
    lesson: "Courage and service belong together.",
    clue: "He was one of seven chosen to serve and became a bold witness."
  },
  {
    name: "Luke",
    also: "Gospel writer",
    symbol: "Scroll",
    color: "#466b75",
    reference: "Luke 1:1-4",
    fact: "He carefully wrote about Jesus and the early church.",
    lesson: "Careful truth-telling helps others learn.",
    clue: "His name is connected with a Gospel and Acts."
  },
  {
    name: "Mark",
    also: "Gospel writer",
    symbol: "Quill",
    color: "#8a4f2b",
    reference: "Mark 1:1",
    fact: "His name is connected with the Gospel of Mark.",
    lesson: "God can keep using people as they grow.",
    clue: "His name is connected with the shortest Gospel."
  },
  {
    name: "Ananias",
    also: "Disciple in Damascus",
    symbol: "Road",
    color: "#2c7a7b",
    reference: "Acts 9:10-19",
    fact: "God sent him to help Saul after the Damascus road.",
    lesson: "Obedience can help someone take their first faithful step.",
    clue: "He helped Saul after Saul met Jesus."
  }
];

const figures = [...apostles, ...extraFigures];

const questions = [
  q("Which apostle was also called Cephas?", "Peter", ["Andrew", "Thomas", "Matthew"], "Names", "Cephas is an Aramaic name meaning rock."),
  q("Who brought Simon Peter to Jesus?", "Andrew", ["John", "Philip", "James"], "Stories", "Andrew first followed Jesus, then brought his brother."),
  q("Which two brothers were called Sons of Thunder?", "James and John", ["Peter and Andrew", "Philip and Matthew", "Thomas and Thaddaeus"], "Names", "Mark 3:17 gives James and John this nickname."),
  q("Which apostle was a tax collector before following Jesus?", "Matthew", ["Simon the Zealot", "Bartholomew", "James the Less"], "Callings", "Matthew, also called Levi, left the tax booth."),
  q("Who is remembered for saying he needed to see Jesus' wounds?", "Thomas", ["Philip", "Peter", "Judas Iscariot"], "Resurrection", "Thomas later confessed Jesus as Lord and God."),
  q("Who betrayed Jesus for silver?", "Judas Iscariot", ["Thaddaeus", "Matthias", "Simon Peter"], "Warnings", "Judas Iscariot betrayed Jesus to the chief priests."),
  q("Who was chosen to replace Judas Iscariot in Acts 1?", "Matthias", ["Paul", "Barnabas", "Stephen"], "Acts", "Matthias was selected by lot after prayer."),
  q("Who asked Jesus, 'Show us the Father'?", "Philip", ["Andrew", "John", "Simon the Zealot"], "Teaching", "Philip asked this in John 14."),
  q("Which apostle is often linked with Nathanael?", "Bartholomew", ["Matthew", "James the Less", "Thaddaeus"], "Names", "Many teachers connect Bartholomew with Nathanael."),
  q("Who was called the Zealot?", "Simon", ["Peter", "Andrew", "James"], "Names", "Luke lists Simon called the Zealot."),
  q("Who did Jesus restore with the question, 'Do you love me?'", "Peter", ["Thomas", "Matthew", "Philip"], "Restoration", "John 21 records Jesus restoring Peter."),
  q("Who met Jesus on the road to Damascus?", "Paul", ["Mark", "Luke", "Timothy"], "Bonus", "Paul was called by the risen Jesus."),
  q("Which apostle was also named Levi?", "Matthew", ["John", "Thomas", "Andrew"], "Names", "Mark and Luke call Matthew Levi."),
  q("Who was John's brother?", "James", ["Peter", "Philip", "Bartholomew"], "Families", "James and John were sons of Zebedee."),
  q("Which apostle is also called Judas son of James?", "Thaddaeus", ["Judas Iscariot", "Matthias", "Simon"], "Names", "Luke and Acts use the name Judas son of James.")
];

questions.push(
  q("Which two apostles were fishermen and brothers?", "Peter and Andrew", ["Matthew and Thomas", "Philip and Bartholomew", "Thaddaeus and Simon"], "Families", "Peter and Andrew were brothers who worked as fishermen."),
  q("Which two apostles were sons of Zebedee?", "James and John", ["Peter and Andrew", "Matthew and James the Less", "Philip and Thomas"], "Families", "James and John were brothers and sons of Zebedee."),
  q("Who said, 'My Lord and my God' after seeing the risen Jesus?", "Thomas", ["Peter", "John", "Philip"], "Resurrection", "Thomas moved from doubt to worship."),
  q("Which apostle walked on water toward Jesus?", "Peter", ["Andrew", "John", "James"], "Miracles", "Peter stepped out of the boat in Matthew 14."),
  q("Who cut off the servant's ear when Jesus was arrested?", "Peter", ["Simon the Zealot", "James", "Thomas"], "Gethsemane", "John 18 identifies Peter as the one who used the sword."),
  q("Which apostle denied knowing Jesus three times?", "Peter", ["Judas Iscariot", "Thomas", "Matthew"], "Passion Week", "Peter denied Jesus before the rooster crowed."),
  q("Which apostle was at the tax booth when Jesus called him?", "Matthew", ["Philip", "Andrew", "Bartholomew"], "Callings", "Matthew immediately followed Jesus from the tax booth."),
  q("Who did Jesus call from a tax booth?", "Matthew", ["Peter", "John", "Thomas"], "Callings", "Matthew left the tax booth to follow Jesus."),
  q("Which apostle is remembered for bringing people to Jesus?", "Andrew", ["Judas Iscariot", "James the Less", "Simon the Zealot"], "Stories", "Andrew brought Peter and later helped bring others to Jesus."),
  q("Which apostle told Nathanael, 'Come and see'?", "Philip", ["Andrew", "Matthew", "Peter"], "Witness", "Philip invited Nathanael to meet Jesus."),
  q("Who asked, 'Can anything good come out of Nazareth?'", "Nathanael", ["Thomas", "Peter", "Matthew"], "Witness", "Nathanael is often linked with Bartholomew."),
  q("Which apostle is often listed with Philip?", "Bartholomew", ["Judas Iscariot", "James", "Simon Peter"], "Names", "Philip and Bartholomew are often named near each other."),
  q("Who asked Jesus, 'Show us the Father'?", "Philip", ["Thomas", "John", "Andrew"], "Teaching", "Jesus answered Philip in John 14."),
  q("Who asked Jesus a question in John 14 and was not Judas Iscariot?", "Thaddaeus", ["Judas Iscariot", "Peter", "James"], "Teaching", "Thaddaeus is also called Judas son of James."),
  q("Which apostle was also known as Didymus?", "Thomas", ["Matthew", "Philip", "Andrew"], "Names", "Didymus means twin."),
  q("Which apostle was also called Levi?", "Matthew", ["Peter", "John", "James"], "Names", "Matthew is called Levi in Mark and Luke."),
  q("Which apostle was also called Simon before Jesus gave him another name?", "Peter", ["Matthew", "Thomas", "Philip"], "Names", "Simon Peter is also called Cephas or Peter."),
  q("Which apostle was the other James?", "James the Less", ["Andrew", "Thomas", "Philip"], "Names", "There were two apostles named James."),
  q("Which apostle was James son of Alphaeus?", "James the Less", ["John", "Peter", "Andrew"], "Names", "James son of Alphaeus is often called James the Less."),
  q("Which apostle was called the Zealot?", "Simon the Zealot", ["Matthew", "Philip", "Bartholomew"], "Names", "Luke and Acts call him Simon the Zealot."),
  q("Which apostle was trusted with the money bag but betrayed Jesus?", "Judas Iscariot", ["Matthew", "Thomas", "Andrew"], "Warnings", "John mentions Judas keeping the money bag."),
  q("Which apostle betrayed Jesus with a kiss?", "Judas Iscariot", ["Peter", "Thaddaeus", "Simon the Zealot"], "Passion Week", "The betrayal in Gethsemane identified Jesus to the crowd."),
  q("Who was replaced after betraying Jesus?", "Judas Iscariot", ["Thomas", "Philip", "Bartholomew"], "Acts", "Acts 1 tells why another witness was chosen."),
  q("Who replaced Judas among the Twelve?", "Matthias", ["Paul", "Luke", "Mark"], "Acts", "Matthias was chosen in Acts 1."),
  q("Who was named with Matthias in Acts 1?", "Joseph called Barsabbas", ["Barnabas", "Silas", "Timothy"], "Acts", "Acts 1 names Joseph and Matthias."),
  q("Which book tells about Matthias being chosen?", "Acts", ["Romans", "Genesis", "Revelation"], "Bible Books", "Acts begins with the apostles after Jesus' resurrection."),
  q("Which apostle preached at Pentecost?", "Peter", ["Matthew", "Thomas", "Andrew"], "Acts", "Peter preached and many believed in Acts 2."),
  q("About how many were added after Peter's Pentecost sermon?", "About 3,000", ["About 12", "About 40", "About 500"], "Acts", "Acts 2 says about three thousand were added."),
  q("Which apostles healed a lame man at the temple gate?", "Peter and John", ["James and Andrew", "Philip and Thomas", "Matthew and Simon"], "Acts", "Acts 3 tells of Peter and John at the Beautiful Gate."),
  q("Which two apostles said they must keep talking about Jesus?", "Peter and John", ["Matthew and Thomas", "James and Philip", "Andrew and Simon"], "Acts", "Peter and John spoke boldly after being warned."),
  q("Which apostle was the brother of Andrew?", "Peter", ["John", "James", "Philip"], "Families", "Andrew brought his brother Simon Peter to Jesus."),
  q("Which apostle was the brother of Peter?", "Andrew", ["James", "John", "Matthew"], "Families", "Andrew and Peter were brothers."),
  q("Which apostle was the brother of James son of Zebedee?", "John", ["Peter", "Andrew", "Thomas"], "Families", "James and John were brothers."),
  q("Which apostle was close to Jesus at the Last Supper?", "John", ["Matthew", "Philip", "Simon the Zealot"], "Gospel Moments", "John's Gospel describes the beloved disciple near Jesus."),
  q("Which apostle did Jesus ask to care for Mary?", "John", ["Peter", "Andrew", "James the Less"], "Passion Week", "Jesus spoke to Mary and the beloved disciple in John 19."),
  q("Who saw Jesus shine in glory with James and John?", "Peter", ["Matthew", "Thomas", "Philip"], "Gospel Moments", "Peter, James, and John were present at the transfiguration."),
  q("Which three apostles saw Jesus shine in glory?", "Peter, James, and John", ["Andrew, Philip, and Matthew", "Thomas, Simon, and Thaddaeus", "Matthias, Paul, and Barnabas"], "Gospel Moments", "This moment is called the transfiguration."),
  q("Who watched and prayed with Jesus in Gethsemane?", "Peter, James, and John", ["Matthew, Thomas, and Philip", "Andrew, Simon, and Thaddaeus", "Bartholomew, Matthias, and Paul"], "Passion Week", "Jesus took Peter, James, and John further into the garden."),
  q("Who said Jesus has the words of eternal life?", "Peter", ["John", "Thomas", "Philip"], "Confession", "Peter confessed faith when many turned away."),
  q("Who said Jesus is the Christ, the Son of God?", "Peter", ["Andrew", "Matthew", "Bartholomew"], "Confession", "Peter said this in Matthew 16."),
  q("Who wanted to build three tents when Jesus shone in glory?", "Peter", ["James", "John", "Thomas"], "Gospel Moments", "Peter spoke during the transfiguration."),
  q("Who asked Jesus, 'How can we know the way?'", "Thomas", ["Philip", "Peter", "John"], "Teaching", "Jesus answered Thomas in John 14."),
  q("Who missed Jesus' first visit to the disciples after the resurrection?", "Thomas", ["Peter", "John", "Matthew"], "Resurrection", "Thomas was not with them in John 20."),
  q("Which apostle went to tell his brother about Jesus?", "Andrew", ["Thomas", "Matthew", "Judas Iscariot"], "Witness", "Andrew first found his brother Simon."),
  q("Which apostle was from Bethsaida?", "Philip", ["Matthew", "Thomas", "Simon the Zealot"], "Places", "John 1 says Philip was from Bethsaida."),
  q("Which city was home for Philip, Andrew, and Peter?", "Bethsaida", ["Bethlehem", "Jericho", "Emmaus"], "Places", "John 1 names Bethsaida."),
  q("Who did Jesus see under a fig tree?", "Nathanael", ["Matthew", "Peter", "James"], "Witness", "Nathanael is often linked with Bartholomew."),
  q("Who did Jesus call an honest man?", "Nathanael", ["Judas Iscariot", "Thomas", "Matthew"], "Character", "Jesus said this about Nathanael in John 1."),
  q("Which apostle is often linked with Nathanael?", "Bartholomew", ["James the Less", "Thaddaeus", "Simon Peter"], "Names", "Many teachers connect Bartholomew with Nathanael."),
  q("Which apostle left a tax booth to follow Jesus?", "Matthew", ["Peter", "Andrew", "Thomas"], "Callings", "Matthew had been a tax collector."),
  q("Which apostle was nicknamed the rock?", "Peter", ["Andrew", "John", "Philip"], "Names", "Peter's name is connected with rock."),
  q("Which apostle brought his brother to Jesus?", "Andrew", ["Matthew", "Thomas", "Judas"], "Witness", "Andrew brought Simon Peter to Jesus."),
  q("Which apostle was also called the twin?", "Thomas", ["John", "James", "Philip"], "Names", "Thomas is also called Didymus, meaning twin."),
  q("Which apostle is usually named first?", "Peter", ["Judas Iscariot", "Matthew", "John"], "Lists", "Peter is usually named first in apostle lists."),
  q("Which apostle is remembered for betraying Jesus?", "Judas Iscariot", ["Matthias", "Thomas", "Andrew"], "Warnings", "Judas Iscariot betrayed Jesus."),
  q("How many apostles were in the original group Jesus chose?", "Twelve", ["Seven", "Ten", "Seventy"], "Basics", "Jesus chose twelve apostles."),
  q("What does the word apostle mean?", "One who is sent", ["One who sings", "One who builds", "One who rules a city"], "Basics", "An apostle is a sent messenger."),
  q("Which Gospel tells about Matthew at the tax booth?", "Matthew", ["Acts", "Romans", "Hebrews"], "Bible Books", "Matthew 9:9 tells this story."),
  q("Which Gospel tells about Thomas saying, 'My Lord and my God'?", "John", ["Matthew", "Mark", "Luke"], "Bible Books", "John 20 records Thomas's confession."),
  q("Which Gospel tells about Andrew bringing Peter to Jesus?", "John", ["Matthew", "Mark", "Luke"], "Bible Books", "John 1 records Andrew bringing Simon."),
  q("Which book records Peter and John healing at the temple?", "Acts", ["John", "Romans", "James"], "Bible Books", "Acts 3 records the healing at the temple gate."),
  q("Which apostle wrote letters to churches after meeting Jesus on the Damascus road?", "Paul", ["Peter", "Andrew", "Philip"], "Bonus", "Paul wrote many New Testament letters."),
  q("What was Paul's name before he was also known as Paul?", "Saul", ["Silas", "Stephen", "Simon"], "Bonus", "Acts introduces him as Saul."),
  q("Where was Paul going when Jesus appeared to him?", "Damascus", ["Jerusalem", "Bethlehem", "Rome"], "Bonus", "Acts 9 tells of the road to Damascus."),
  q("Who prayed for Saul after he met Jesus?", "Ananias", ["Matthias", "Andrew", "Philip"], "Bonus", "Ananias obeyed God and went to Saul."),
  q("Which apostle preached especially to Gentiles?", "Paul", ["Peter", "John", "Matthew"], "Bonus", "Gentiles are people from the nations outside Israel."),
  q("Who preached to Cornelius's family?", "Peter", ["Paul", "Matthew", "Thomas"], "Acts", "Peter preached to Cornelius in Acts 10."),
  q("Who saw a vision of a sheet with animals?", "Peter", ["John", "Philip", "James"], "Acts", "The vision prepared Peter to visit Cornelius."),
  q("Which apostle was imprisoned and then freed by an angel in Acts 12?", "Peter", ["Matthew", "Thomas", "Simon the Zealot"], "Acts", "Acts 12 tells of Peter's rescue from prison."),
  q("Which apostle was killed by Herod in Acts 12?", "James son of Zebedee", ["James the Less", "John", "Andrew"], "Acts", "James was John's brother."),
  q("Which apostle was John's brother?", "James son of Zebedee", ["Peter", "Andrew", "Thomas"], "Families", "James and John were brothers."),
  q("Who ran to the empty tomb with Peter?", "John", ["Matthew", "Thomas", "Philip"], "Resurrection", "John tells about Peter and the beloved disciple running to the tomb."),
  q("Who went inside the empty tomb?", "Peter", ["Andrew", "Matthew", "Philip"], "Resurrection", "Peter went into the tomb in John 20."),
  q("Who said, 'It is the Lord' by the sea?", "John", ["Peter", "Thomas", "Matthew"], "Resurrection", "John recognized Jesus in John 21."),
  q("Who jumped into the sea to get to Jesus?", "Peter", ["John", "Thomas", "Andrew"], "Resurrection", "Peter hurried toward Jesus in John 21."),
  q("Who asked Jesus how many times to forgive?", "Peter", ["Andrew", "Matthew", "John"], "Teaching", "Peter asked Jesus about forgiveness."),
  q("Who asked Jesus about the reward for leaving everything?", "Peter", ["Thomas", "Philip", "Matthew"], "Teaching", "Peter asked what the disciples would have after leaving all."),
  q("Which apostle used to collect taxes?", "Matthew", ["Andrew", "John", "James"], "Callings", "Matthew had been a tax collector."),
  q("Which apostle worked with nets and boats?", "Andrew", ["Matthew", "Thaddaeus", "James the Less"], "Callings", "Andrew was a fisherman."),
  q("Which two sets of brothers were among the Twelve?", "Peter and Andrew, James and John", ["Matthew and Thomas, Philip and Paul", "Simon and Judas, Matthias and Mark", "Bartholomew and James, Luke and John"], "Families", "The Twelve included two brother pairs."),
  q("Whose mother asked Jesus for special seats for her sons?", "James and John", ["Peter and Andrew", "Matthew and Thomas", "Philip and Bartholomew"], "Teaching", "Their mother asked this in Matthew 20."),
  q("Which brothers were called Sons of Thunder?", "James and John", ["Peter and Andrew", "Matthew and Philip", "Thomas and Thaddaeus"], "Character", "James and John had this nickname."),
  q("Which apostle is also called Jude?", "Thaddaeus", ["Thomas", "Matthew", "Simon Peter"], "Names", "Thaddaeus is also called Jude or Judas son of James."),
  q("Which apostle was named Judas but was not the betrayer?", "Thaddaeus", ["Peter", "Andrew", "Matthew"], "Names", "This was Judas son of James, not Judas Iscariot."),
  q("Who betrayed Jesus even though he was in the group?", "Judas Iscariot", ["John", "Andrew", "James the Less"], "Warnings", "Judas was close to Jesus but betrayed Him."),
  q("Who got a second chance after denying Jesus?", "Peter", ["Judas Iscariot", "Matthew", "Philip"], "Restoration", "Jesus restored Peter after Peter's denial."),
  q("Who had honest questions and then believed?", "Thomas", ["Judas Iscariot", "Simon the Zealot", "Matthew"], "Application", "Thomas asked honestly and then confessed Jesus as Lord."),
  q("Who invited his brother to meet Jesus?", "Andrew", ["James the Less", "Judas Iscariot", "Simon the Zealot"], "Application", "Andrew brought his brother Peter to Jesus."),
  q("Who left an unpopular job to follow Jesus?", "Matthew", ["John", "Andrew", "James"], "Application", "Matthew had been a tax collector."),
  q("Whose title was the Zealot?", "Simon the Zealot", ["Matthew", "Thomas", "Bartholomew"], "Names", "Simon is called the Zealot in Luke and Acts."),
  q("Which apostle is easy to miss because little is said about him?", "James the Less", ["Peter", "John", "Paul"], "Application", "James son of Alphaeus is listed with the Twelve."),
  q("Who was chosen after Judas was gone?", "Matthias", ["Judas Iscariot", "Thomas", "Philip"], "Acts", "Matthias joined the Twelve in Acts 1."),
  q("Whose life changed on the road to Damascus?", "Paul", ["Andrew", "John", "Matthew"], "Application", "Paul went from fighting the church to preaching Christ."),
  q("Which apostle is often linked with Revelation?", "John", ["Matthew", "Peter", "Thomas"], "Bible Books", "Many Christians connect John with Revelation."),
  q("Which Gospel begins with Jesus' family line?", "Matthew", ["Andrew", "Thomas", "Philip"], "Bible Books", "Matthew begins with Jesus' genealogy."),
  q("Which apostle has letters called First and Second?", "Peter", ["Paul", "John", "James"], "Bible Books", "The New Testament includes 1 Peter and 2 Peter."),
  q("Which apostle has three short letters named for him?", "John", ["Peter", "Matthew", "Andrew"], "Bible Books", "The New Testament includes 1 John, 2 John, and 3 John."),
  q("Who wrote many letters in the New Testament?", "Paul", ["Matthias", "Bartholomew", "Simon the Zealot"], "Bonus", "Paul wrote many New Testament letters."),
  q("Who asked Jesus about future signs on the Mount of Olives?", "Peter", ["Matthew", "Thomas", "Judas Iscariot"], "Teaching", "Mark 13 names Peter, James, John, and Andrew."),
  q("Which four apostles asked Jesus a private question in Mark 13?", "Peter, James, John, and Andrew", ["Matthew, Thomas, Philip, and Simon", "Paul, Matthias, Barnabas, and Mark", "Bartholomew, Thaddaeus, Judas, and Matthew"], "Teaching", "Mark 13 names these four."),
  q("Which apostle joined Peter, James, and John in Mark 13?", "Andrew", ["Matthew", "Thomas", "Philip"], "Teaching", "Andrew asked with Peter, James, and John."),
  q("Who did Jesus tell, 'Feed my sheep'?", "Peter", ["John", "Andrew", "Matthew"], "Restoration", "Jesus told Peter to feed His sheep in John 21."),
  q("Who asked Jesus about John's future?", "Peter", ["Thomas", "Philip", "Matthew"], "Resurrection", "Peter asked Jesus about John in John 21."),
  q("Which apostle is named in every list of the Twelve?", "Peter", ["Paul", "Matthias", "Barnabas"], "Lists", "Peter appears in the apostle lists and is usually first."),
  q("Who was added to the Twelve after Judas?", "Matthias", ["Paul", "Luke", "Stephen"], "Acts", "Matthias replaced Judas Iscariot."),
  q("Who was called by the risen Jesus after the resurrection?", "Paul", ["Matthew", "Andrew", "Bartholomew"], "Bonus", "Paul met the risen Jesus on the Damascus road."),
  q("Which apostle reminds us to bring questions to Jesus?", "Thomas", ["Judas Iscariot", "Simon the Zealot", "James the Less"], "Application", "Thomas brought his questions to Jesus."),
  q("Which apostle reminds us to invite family or friends?", "Andrew", ["Peter", "Judas Iscariot", "Matthew"], "Application", "Andrew brought Peter to Jesus."),
  q("Which apostle reminds us Jesus gives second chances?", "Peter", ["Judas Iscariot", "Philip", "Bartholomew"], "Application", "Peter denied Jesus but was restored."),
  q("Which apostle reminds us Jesus can call anyone?", "Matthew", ["John", "James", "Andrew"], "Application", "Matthew left the tax booth when Jesus called."),
  q("Who was known by Jesus before Philip called him?", "Nathanael", ["Matthew", "Simon Peter", "Judas Iscariot"], "Application", "Jesus saw Nathanael before Philip called him.")
);

const state = {
  mode: "quest",
  sound: true,
  current: 0,
  roundLength: 10,
  questionOrder: [],
  recentQuestionOrder: [],
  mapStep: 0,
  score: 0,
  streak: 0,
  teamTurn: 0,
  teams: [
    { name: "Team Olive", score: 0 },
    { name: "Team Sea", score: 0 }
  ],
  answered: false,
  selectedName: null,
  selectedClue: null,
  matched: new Set()
};

const el = {
  scoreboard: document.querySelector("#scoreboard"),
  titleView: document.querySelector("#titleView"),
  finishView: document.querySelector("#finishView"),
  gameContent: document.querySelector("#gameContent"),
  featuredCard: document.querySelector("#featuredCard"),
  questionLayout: document.querySelector("#questionLayout"),
  questionCard: document.querySelector(".question-card"),
  roundLabel: document.querySelector("#roundLabel"),
  categoryLabel: document.querySelector("#categoryLabel"),
  questionText: document.querySelector("#questionText"),
  answerGrid: document.querySelector("#answerGrid"),
  feedback: document.querySelector("#feedback"),
  hintButton: document.querySelector("#hintButton"),
  nextButton: document.querySelector("#nextButton"),
  journeyMap: document.querySelector(".journey-map"),
  mapCallout: document.querySelector("#mapCallout"),
  mapStops: document.querySelector("#mapStops"),
  menuButton: document.querySelector("#menuButton"),
  resetGame: document.querySelector("#resetGame"),
  soundToggle: document.querySelector("#soundToggle"),
  startQuest: document.querySelector("#startQuest"),
  startTeams: document.querySelector("#startTeams"),
  openCards: document.querySelector("#openCards"),
  playAgain: document.querySelector("#playAgain"),
  backToTitle: document.querySelector("#backToTitle"),
  winnerTitle: document.querySelector("#winnerTitle"),
  winnerSummary: document.querySelector("#winnerSummary"),
  finalScores: document.querySelector("#finalScores"),
  teamOneName: document.querySelector("#teamOneName"),
  teamTwoName: document.querySelector("#teamTwoName"),
  nameList: document.querySelector("#nameList"),
  clueList: document.querySelector("#clueList"),
  cardGrid: document.querySelector("#cardGrid")
};

function q(text, answer, wrong, category, hint) {
  return { text, answer, options: shuffle([answer, ...wrong]), category, hint };
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function buildRoundOrder(totalCount, roundLength, recentOrder) {
  const allIndexes = [...Array(totalCount).keys()];
  const recent = new Set(recentOrder);
  const freshIndexes = allIndexes.filter(index => !recent.has(index));
  const preferredPool = freshIndexes.length >= roundLength ? freshIndexes : allIndexes;
  const order = shuffle(preferredPool).slice(0, roundLength);

  if (order.length < roundLength) {
    const chosen = new Set(order);
    order.push(...shuffle(allIndexes.filter(index => !chosen.has(index))).slice(0, roundLength - order.length));
  }

  return order;
}

function reshuffleQuestions() {
  state.questionOrder = buildRoundOrder(questions.length, state.roundLength, state.recentQuestionOrder);
  state.recentQuestionOrder = [...state.questionOrder];
}

const mapPositions = [
  { x: 8, y: 69 },
  { x: 19, y: 33 },
  { x: 34, y: 58 },
  { x: 50, y: 77 },
  { x: 66, y: 38 },
  { x: 83, y: 57 },
  { x: 92, y: 66 }
];

const journeyStops = [
  { label: "Galilee", note: "Jesus calls ordinary people to follow." },
  { label: "Sea Shore", note: "Nets are left behind for a greater mission." },
  { label: "Capernaum", note: "Teaching, healing, and faith begin to spread." },
  { label: "Bethsaida", note: "Andrew, Peter, and Philip point others to Jesus." },
  { label: "Hillside", note: "Crowds gather and the disciples learn trust." },
  { label: "Mount Hermon", note: "Peter, James, and John see Jesus' glory." },
  { label: "Samaria Road", note: "Good news moves beyond familiar places." },
  { label: "Jericho Road", note: "Jesus teaches mercy on the road." },
  { label: "Bethany", note: "Friends gather near Jerusalem." },
  { label: "Upper Room", note: "Jesus prepares His followers to serve." },
  { label: "Gethsemane", note: "The disciples learn watchfulness and prayer." },
  { label: "Jerusalem", note: "The apostles witness the cross and resurrection." },
  { label: "Empty Tomb", note: "The message changes from fear to joy." },
  { label: "Temple Gate", note: "Peter and John speak boldly in Acts." },
  { label: "Pentecost", note: "The Spirit empowers witness." },
  { label: "Joppa", note: "Peter learns the mission is bigger than expected." },
  { label: "Caesarea", note: "Cornelius hears the good news." },
  { label: "Damascus Road", note: "Jesus transforms Saul into Paul." },
  { label: "Antioch", note: "The church sends messengers outward." },
  { label: "Cyprus", note: "Mission journeys begin across the sea." },
  { label: "Pisidian Antioch", note: "Paul teaches from Scripture." },
  { label: "Lystra", note: "Courage continues through hardship." },
  { label: "Philippi", note: "A jailer and his household hear the gospel." },
  { label: "Thessalonica", note: "The message reaches new communities." },
  { label: "Athens", note: "Paul speaks about the unknown God." },
  { label: "Corinth", note: "A church grows in a busy city." },
  { label: "Ephesus", note: "Disciples learn and serve together." },
  { label: "Caesarea Harbor", note: "The journey turns toward Rome." },
  { label: "Malta", note: "God preserves Paul after shipwreck." },
  { label: "Rome", note: "The witness reaches the heart of the empire." },
  { label: "Mission", note: "Students carry the lesson into daily life." }
];

function portrait(apostle) {
  const seed = [...apostle.name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const encodedName = escapeHtml(apostle.name);
  const uid = apostle.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const skinTones = ["#c98f5d", "#b97849", "#d7a06c", "#a86f48", "#e0ad79"];
  const hairColors = ["#2f2118", "#4a2d1a", "#5b3924", "#6b4a2e", "#ded0b2"];
  const beardShapes = [
    "M86 104c8 24 18 36 34 36s26-12 34-36c-17 10-51 10-68 0z",
    "M84 101c8 33 21 49 36 49s28-16 36-49c-21 15-51 15-72 0z",
    "M91 108c6 18 16 27 29 27s23-9 29-27c-17 8-41 8-58 0z"
  ];
  const hairShapes = [
    "M63 86c2-38 25-64 57-64 34 0 57 27 59 66-22-20-44-28-68-24-19 3-34 10-48 22z",
    "M58 89c4-42 29-66 68-62 27 3 48 28 45 61-19-13-35-21-54-21-25 0-42 8-59 22z",
    "M68 83c7-37 28-57 61-54 27 2 45 21 47 57-16-8-32-14-53-16-23-1-39 4-55 13z"
  ];
  const skin = skinTones[seed % skinTones.length];
  const hair = hairColors[seed % hairColors.length];
  const robe = apostle.color;
  const accent = seed % 2 === 0 ? "#fff4d2" : "#e8f0ff";
  const beard = beardShapes[seed % beardShapes.length];
  const hairPath = hairShapes[seed % hairShapes.length];
  const browLift = seed % 3;

  return `
    <svg viewBox="0 0 220 220" role="img" aria-label="${encodedName} portrait" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg-${uid}" x1="26" y1="18" x2="192" y2="208" gradientUnits="userSpaceOnUse">
          <stop stop-color="#fff7df"/>
          <stop offset=".56" stop-color="#ead7a9"/>
          <stop offset="1" stop-color="${robe}"/>
        </linearGradient>
        <linearGradient id="robe-${uid}" x1="70" y1="118" x2="172" y2="214" gradientUnits="userSpaceOnUse">
          <stop stop-color="${robe}"/>
          <stop offset="1" stop-color="#17212b"/>
        </linearGradient>
        <filter id="soft-${uid}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="9" stdDeviation="7" flood-color="#17212b" flood-opacity=".22"/>
        </filter>
      </defs>
      <rect width="220" height="220" rx="22" fill="url(#bg-${uid})"/>
      <circle cx="178" cy="42" r="32" fill="#ffffff" opacity=".24"/>
      <path d="M0 160c31-27 66-31 105-12 38 20 72 21 115-4v76H0z" fill="#17212b" opacity=".13"/>
      <path d="M38 192c10-48 38-76 79-76 39 0 65 27 75 76z" fill="url(#robe-${uid})" filter="url(#soft-${uid})"/>
      <path d="M77 192c7-38 24-58 51-62 25 5 43 25 53 62z" fill="${accent}" opacity=".92"/>
      <path d="M102 128l17 28 19-28" fill="none" stroke="#d8b766" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
      <ellipse cx="110" cy="82" rx="43" ry="48" fill="${skin}" filter="url(#soft-${uid})"/>
      <path d="${hairPath}" fill="${hair}"/>
      <path d="M72 73c6-26 23-43 49-44 27-1 47 17 53 45-33-17-68-17-102-1z" fill="#ffffff" opacity=".08"/>
      <path d="${beard}" fill="${hair}" opacity=".95"/>
      <circle cx="91" cy="86" r="4.6" fill="#16202a"/>
      <circle cx="129" cy="86" r="4.6" fill="#16202a"/>
      <circle cx="92" cy="84" r="1.5" fill="#ffffff"/>
      <circle cx="130" cy="84" r="1.5" fill="#ffffff"/>
      <path d="M82 ${78 - browLift}c8-5 15-5 23-1" fill="none" stroke="${hair}" stroke-width="5" stroke-linecap="round"/>
      <path d="M119 ${77 + browLift}c8-4 16-4 24 1" fill="none" stroke="${hair}" stroke-width="5" stroke-linecap="round"/>
      <path d="M103 103c8 7 18 7 27 0" fill="none" stroke="#5c3424" stroke-width="4" stroke-linecap="round"/>
      <path d="M69 92c-9-11-11-2-9 8 2 9 8 13 14 11" fill="${skin}"/>
      <path d="M151 92c9-11 11-2 9 8-2 9-8 13-14 11" fill="${skin}"/>
      <circle cx="110" cy="104" r="82" fill="none" stroke="#fff4c2" stroke-width="5" opacity=".55"/>
      <path d="M58 188c22 12 80 12 108 0" fill="none" stroke="#fff4c2" stroke-width="5" opacity=".45" stroke-linecap="round"/>
    </svg>`;
}

function portraitMarkup(apostle) {
  if (apostle.image) {
    return `
      <div class="portrait art-card">
        <img src="${escapeAttr(apostle.image)}" alt="${escapeAttr(apostle.name)} storybook portrait" loading="lazy">
      </div>`;
  }

  return `<div class="portrait">${portrait(apostle)}</div>`;
}

function cardTemplate(apostle, compact = false) {
  if (compact) {
    return `
      <article class="mini-card">
        ${portraitMarkup(apostle)}
        <h2>${escapeHtml(apostle.name)}</h2>
        <p>${escapeHtml(apostle.clue)}</p>
      </article>`;
  }

  return `
    ${portraitMarkup(apostle)}
    <h2>${escapeHtml(apostle.name)}</h2>
    <p class="subtitle">${escapeHtml(apostle.also)}</p>
    <dl class="fact-list">
      <div><dt>Symbol</dt><dd>${escapeHtml(apostle.symbol)}</dd></div>
      <div><dt>Reference</dt><dd>${escapeHtml(apostle.reference)}</dd></div>
      <div><dt>Class Point</dt><dd>${escapeHtml(apostle.lesson)}</dd></div>
    </dl>`;
}

function currentQuestion() {
  if (state.questionOrder.length !== state.roundLength) {
    reshuffleQuestions();
  }
  return questions[state.questionOrder[state.current]];
}

function normalizeAnswer(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function figureSearchTerms(figure) {
  const terms = [figure.name, figure.also]
    .flatMap(value => String(value).split(","))
    .map(normalizeAnswer)
    .filter(Boolean);
  if (figure.name === "Bartholomew") terms.push("nathanael");
  if (figure.name === "Simon the Zealot") terms.push("simon");
  if (figure.name === "Peter") terms.push("simon peter", "cephas");
  if (figure.name === "Thaddaeus") terms.push("judas son of james", "jude");
  if (figure.name === "Paul") terms.push("saul", "saul of tarsus");
  if (figure.name === "Joseph called Barsabbas") terms.push("joseph barsabbas", "barsabbas");
  return terms;
}

function resolveFigureForAnswer(answer) {
  const normalizedAnswer = normalizeAnswer(answer);
  return figures.find(figure => figureSearchTerms(figure).some(term => normalizedAnswer === term))
    || figures.find(figure => figureSearchTerms(figure).some(term => normalizedAnswer.includes(term)));
}

function currentFigure() {
  const question = currentQuestion();
  return resolveFigureForAnswer(question.answer);
}

function renderScoreboard() {
  const tiles = [
    `<div class="score-tile"><span>Quest Score</span><strong>${state.score}</strong></div>`,
    `<div class="score-tile"><span>Streak</span><strong>${state.streak}</strong></div>`,
    ...state.teams.map((team, index) => `
      <div class="score-tile ${state.mode === "teams" && state.teamTurn === index ? "active-team" : ""}">
        <span>${team.name}</span><strong>${team.score}</strong>
      </div>`)
  ];
  el.scoreboard.innerHTML = tiles.join("");
}

function renderMap() {
  const step = Math.min(state.mapStep, journeyStops.length - 1);
  const segmentStart = Math.min(Math.floor(step / 6) * 6, Math.max(0, journeyStops.length - mapPositions.length));
  const visibleStops = journeyStops.slice(segmentStart, segmentStart + mapPositions.length);
  const currentIndex = step - segmentStart;
  const currentStop = journeyStops[step];
  const nextStop = journeyStops[Math.min(step + 1, journeyStops.length - 1)];
  const compact = window.matchMedia("(max-width: 850px)").matches;

  el.mapCallout.innerHTML = `
    <strong>${escapeHtml(currentStop.label)}</strong>
    <span>${escapeHtml(currentStop.note)}</span>
    <em>Next: ${escapeHtml(nextStop.label)}</em>`;

  el.journeyMap.classList.toggle("compact-map", compact);

  if (compact) {
    const progress = Math.round((step / (journeyStops.length - 1)) * 100);
    el.mapStops.innerHTML = `
      <div class="map-progress" style="--progress: ${progress}%;">
        <span class="map-progress-track"><span></span></span>
        <div class="map-progress-labels">
          <strong>${escapeHtml(currentStop.label)}</strong>
          <span>${step + 1} / ${journeyStops.length}</span>
          <em>${step === journeyStops.length - 1 ? "Journey complete" : `Toward ${escapeHtml(nextStop.label)}`}</em>
        </div>
      </div>`;
    return;
  }

  el.mapStops.innerHTML = visibleStops.map((stop, index) => {
    const absoluteIndex = segmentStart + index;
    const status = absoluteIndex < step ? "complete" : index === currentIndex ? "current" : "";
    const pos = mapPositions[index];
    return `
      <div class="map-stop ${status}" style="left: ${pos.x}%; top: ${pos.y}%;" aria-label="${escapeAttr(stop.label)}" title="${escapeAttr(stop.label)}">
        <span class="stop-dot"></span>
      </div>`;
}).join("");
}

function renderQuestion() {
  const question = currentQuestion();
  state.answered = false;
  el.featuredCard.innerHTML = "";
  el.featuredCard.hidden = true;
  el.questionLayout.classList.remove("hint-open");
  el.questionCard.classList.remove("correct-flash", "wrong-flash");
  el.hintButton.textContent = "Show Hint";
  el.nextButton.textContent = "Next Question";
  el.roundLabel.textContent = `Question ${state.current + 1} of ${state.roundLength}`;
  el.categoryLabel.textContent = question.category;
  el.questionText.textContent = question.text;
  el.feedback.textContent = state.mode === "teams"
    ? `${state.teams[state.teamTurn].name}, choose an answer.`
    : "Choose an answer.";
  el.feedback.className = "feedback";
  el.answerGrid.innerHTML = question.options.map(option => (
    `<button class="answer-button" type="button" data-answer="${escapeAttr(option)}">${escapeHtml(option)}</button>`
  )).join("");
  document.querySelectorAll(".answer-button").forEach(button => {
    button.addEventListener("click", () => chooseAnswer(button));
  });
  renderScoreboard();
  renderMap();
}

function setFeaturedCard(answer, reveal = true) {
  const figure = resolveFigureForAnswer(answer);
  if (!figure) {
    el.featuredCard.innerHTML = "";
    el.featuredCard.hidden = true;
    el.questionLayout.classList.remove("hint-open");
    return false;
  }

  el.featuredCard.innerHTML = cardTemplate(figure);
  el.featuredCard.hidden = !reveal;
  el.questionLayout.classList.toggle("hint-open", reveal);
  return true;
}

function chooseAnswer(button) {
  if (state.answered) return;
  state.answered = true;
  const question = currentQuestion();
  const answer = button.dataset.answer;
  const correct = answer === question.answer;

  document.querySelectorAll(".answer-button").forEach(btn => {
    if (btn.dataset.answer === question.answer) btn.classList.add("correct");
    else if (btn === button) btn.classList.add("wrong");
  });

  if (correct) {
    const points = 100 + Math.min(5, state.streak) * 20;
    state.score += points;
    state.streak += 1;
    if (state.mode === "teams") {
      state.teams[state.teamTurn].score += points;
    }
    state.mapStep += 1;
    el.feedback.textContent = `Correct. ${question.hint}`;
    el.feedback.className = "feedback good";
    flashQuestionCard("correct-flash");
    tone(660, 0.11, "triangle");
  } else {
    state.streak = 0;
    el.feedback.textContent = `Not quite. The answer is ${question.answer}. ${question.hint}`;
    el.feedback.className = "feedback bad";
    flashQuestionCard("wrong-flash");
    tone(180, 0.16, "sawtooth");
  }

  if (state.current + 1 >= state.roundLength) {
    el.nextButton.textContent = "Show Results";
  }

  setFeaturedCard(question.answer, true);

  if (state.mode === "teams") {
    state.teamTurn = (state.teamTurn + 1) % state.teams.length;
  }
  renderScoreboard();
  renderMap();
}

function nextQuestion() {
  if (state.current + 1 >= state.roundLength) {
    showFinish();
    return;
  }
  state.current += 1;
  renderQuestion();
}

function flashQuestionCard(className) {
  el.questionCard.classList.remove("correct-flash", "wrong-flash");
  void el.questionCard.offsetWidth;
  el.questionCard.classList.add(className);
}

function showHint() {
  const showingHint = el.featuredCard.hidden;
  const hasCard = showingHint ? setFeaturedCard(currentQuestion().answer, true) : false;
  if (!showingHint) {
    el.featuredCard.hidden = true;
    el.questionLayout.classList.remove("hint-open");
  }
  el.hintButton.textContent = showingHint ? "Hide Hint" : "Show Hint";
  el.feedback.textContent = showingHint
    ? currentQuestion().hint
    : "Hint hidden.";
  if (showingHint && !hasCard) {
    el.feedback.textContent = `${currentQuestion().hint} No person card is needed for this answer.`;
  }
  el.feedback.className = "feedback";
}

function renderCards() {
  el.cardGrid.innerHTML = apostles.map(apostle => cardTemplate(apostle, true)).join("");
}

function renderMatch() {
  const set = shuffle(apostles.slice(0, 8));
  state.selectedName = null;
  state.selectedClue = null;
  state.matched = new Set();
  el.nameList.innerHTML = set.map(apostle => (
    `<button class="match-item" type="button" data-kind="name" data-id="${escapeAttr(apostle.name)}">${escapeHtml(apostle.name)}</button>`
  )).join("");
  el.clueList.innerHTML = shuffle(set).map(apostle => (
    `<button class="match-item" type="button" data-kind="clue" data-id="${escapeAttr(apostle.name)}">${escapeHtml(apostle.clue)}</button>`
  )).join("");
  document.querySelectorAll(".match-item").forEach(item => item.addEventListener("click", () => selectMatch(item)));
}

function selectMatch(item) {
  if (item.classList.contains("matched")) return;
  const kind = item.dataset.kind;
  document.querySelectorAll(`.match-item[data-kind="${kind}"]`).forEach(btn => btn.classList.remove("selected"));
  item.classList.add("selected");
  if (kind === "name") state.selectedName = item;
  if (kind === "clue") state.selectedClue = item;

  if (!state.selectedName || !state.selectedClue) return;
  if (state.selectedName.dataset.id === state.selectedClue.dataset.id) {
    state.selectedName.classList.add("matched");
    state.selectedClue.classList.add("matched");
    state.selectedName.classList.remove("selected");
    state.selectedClue.classList.remove("selected");
    state.score += 75;
    tone(520, 0.1, "sine");
  } else {
    state.selectedName.classList.remove("selected");
    state.selectedClue.classList.remove("selected");
    tone(160, 0.12, "square");
  }
  state.selectedName = null;
  state.selectedClue = null;
  renderScoreboard();
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll(".tab").forEach(tab => tab.classList.toggle("active", tab.dataset.mode === mode));
  document.querySelectorAll(".view").forEach(view => view.classList.remove("active"));

  const target = mode === "match" ? "matchView" : mode === "cards" ? "cardsView" : "questView";
  document.querySelector(`#${target}`).classList.add("active");
  if (mode === "match") renderMatch();
  if (mode === "cards") renderCards();
  if (mode === "quest" || mode === "teams") renderQuestion();
  renderScoreboard();
}

function applySettings() {
  state.teams[0].name = cleanTeamName(el.teamOneName.value, "Team Olive");
  state.teams[1].name = cleanTeamName(el.teamTwoName.value, "Team Sea");
}

function cleanTeamName(value, fallback) {
  const name = value.trim();
  return name.length > 0 ? name : fallback;
}

function showTitle() {
  el.titleView.hidden = false;
  el.finishView.hidden = true;
  el.gameContent.hidden = true;
}

function startRound(mode) {
  applySettings();
  state.mode = mode;
  state.current = 0;
  reshuffleQuestions();
  state.mapStep = 0;
  state.score = 0;
  state.streak = 0;
  state.teamTurn = 0;
  state.teams.forEach(team => team.score = 0);
  el.titleView.hidden = true;
  el.finishView.hidden = true;
  el.gameContent.hidden = false;
  setMode(mode);
}

function showFinish() {
  el.gameContent.hidden = true;
  el.finishView.hidden = false;

  if (state.mode === "teams") {
    const [teamOne, teamTwo] = state.teams;
    let title = "It is a tie";
    if (teamOne.score > teamTwo.score) title = `${teamOne.name} wins`;
    if (teamTwo.score > teamOne.score) title = `${teamTwo.name} wins`;
    el.winnerTitle.textContent = title;
    el.winnerSummary.textContent = `Completed ${state.roundLength} questions. Use the scores as a springboard for a quick review conversation.`;
    el.finalScores.innerHTML = state.teams.map(team => `
      <div class="final-score"><span>${escapeHtml(team.name)}</span><strong>${team.score}</strong></div>
    `).join("");
  } else {
    el.winnerTitle.textContent = "Solo Quest Complete";
    el.winnerSummary.textContent = `You scored ${state.score} points across ${state.roundLength} questions with a final streak of ${state.streak}.`;
    el.finalScores.innerHTML = `
      <div class="final-score"><span>Score</span><strong>${state.score}</strong></div>
      <div class="final-score"><span>Journey Stops</span><strong>${Math.min(state.mapStep, journeyStops.length - 1)}</strong></div>
    `;
  }
}

function resetGame() {
  if (el.gameContent.hidden) {
    showTitle();
    return;
  }
  startRound(state.mode === "teams" ? "teams" : "quest");
  renderMatch();
}

function tone(freq, duration, type) {
  if (!state.sound) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.09, ctx.currentTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration + 0.02);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value) {
  return escapeHtml(value);
}

document.querySelectorAll(".tab").forEach(tab => tab.addEventListener("click", () => setMode(tab.dataset.mode)));
document.querySelectorAll(".segment").forEach(button => {
  button.addEventListener("click", () => {
    state.roundLength = Number(button.dataset.round);
    document.querySelectorAll(".segment").forEach(segment => segment.classList.toggle("active", segment === button));
  });
});
el.startQuest.addEventListener("click", () => startRound("quest"));
el.startTeams.addEventListener("click", () => startRound("teams"));
el.openCards.addEventListener("click", () => {
  el.titleView.hidden = true;
  el.finishView.hidden = true;
  el.gameContent.hidden = false;
  setMode("cards");
});
el.playAgain.addEventListener("click", () => startRound(state.mode === "teams" ? "teams" : "quest"));
el.backToTitle.addEventListener("click", showTitle);
el.menuButton.addEventListener("click", showTitle);
el.nextButton.addEventListener("click", nextQuestion);
el.hintButton.addEventListener("click", showHint);
el.resetGame.addEventListener("click", resetGame);
el.soundToggle.addEventListener("click", () => {
  state.sound = !state.sound;
  el.soundToggle.textContent = state.sound ? "S" : "M";
});
window.addEventListener("resize", () => {
  if (!el.gameContent.hidden && document.querySelector("#questView").classList.contains("active")) {
    renderMap();
  }
});

showTitle();
