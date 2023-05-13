import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  
  console.log("received blog requst")
  console.log(req.body)
  if (req.method === 'POST') {
    const { title, author,description,content } = req.body;
    let status = 'published'
    let name = title
    let slug = ''
    
    let coverImage = '/images/industrial-pattern.png'
    // const blog = await prisma.blog.create({
    //   data: {
    //     title,
    //     author,
    //     description,
    //     content,
    //     status,
    //     name,
    //     slug,
    //     coverImage,
    //   },
    // });

    try {
      const { title, content } = req.body;
      console.log('title ', title) 
      console.log('content ', content)
      var newContent = content
      //var newContent = content.replace(/\n/g, '');
      //newContent = newContent.replace(/\r\n/g, '');
      //newContent = newContent.replace(/\r/g, '');
      //newContent = newContent.replace(/\t/g, '    ');
      console.log('newContent ',newContent)
      // Validate the data
      if (!title || !content) {
        return res.status(400).json({ message: 'Both title and content are required.' });
      }

      // var titles = '王阳明'
      // newContent = '王阳明的学生'
      let tags = ['tag1', 'tag2']
      let authors = ['default']
      // let tagStr = JSON.stringify(tags)
      // let authorStr = JSON.stringify(authors)
      let images = ['https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/688b5c542ed54d34ac4bb4117e9c040d~tplv-k3u1fbpfcp-watermark.image?']
      // let imagesStr = JSON.stringify(images)
      // Create the markdown content with frontmatter
      var summary = newContent.slice(0, 200);
      const markdownData = matter.stringify(newContent, 
        { 
        title, 
        date: new Date().toISOString().slice(0, 10),
        lastmod: new Date().toISOString().slice(0, 10),
        tags,
        authors,
        images,
        draft: false,
        summary: summary,
        status,
        name,
        slug,
        coverImage,
        layout: 'PostLayout'
      });

      // Save the markdown file
      const filePath = join(process.cwd(), 'data/blog', `${title}.md`);
      fs.writeFileSync(filePath, markdownData);

      // Send success response
      res.status(201).json({ message: 'Markdown file saved successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while saving the markdown file.' });
    }

    // res.status(201).json(blog);
    // res.status(201).json({'message':"success saved!"});
  } else if (req.method === 'GET') {
    const { name } = req.query;
    // JSON.stringify(user)
    const blogs = await prisma.blog.findMany({})
    
    res.status(200).json({
      errcode: 0,
      errmsg: "ok",
      data: blogs,
    },
    {
      status: 200,
    });
    
  } else {
    res.status(405).end();
  }
}
