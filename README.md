
# Job Portal Application  

 **Next.js-based Job Portal Application** deployed on **Vercel**, using **MongoDB Atlas** as the database.  


 ** Features  **
 **Next.js Frontend** (Deployed on Vercel)  
 **MongoDB Atlas Database Integration**  
 **Setuo Environmental variable** 


  **Project Setup & Deployment on Vercel**  

**Step 1: Clone the Repository & Set Up Git**

git clone https://github.com/yourusername/job-portal-app.git
cd job-portal-app
git init
git add .
git commit -m "Initial commit"
git branch -M master
git remote add origin https://github.com/yourusername/job-portal-app.git
git push -u origin master
Step 2: Deploy Frontend on Vercel
1️. Go to Vercel and log in.
2️. Click "New Project" → Import your GitHub repository.
3️. Select Next.js as the framework.
4️. Set the Root Directory to client/ (if separate from backend).
5️. Click "Deploy" and wait for Vercel to generate a live link.
6️. Click on the domain name to access the application.
![vercel overview](https://github.com/user-attachments/assets/8bc3a630-cfd2-4363-8f27-3bfe33eb13b0)
![domain page](https://github.com/user-attachments/assets/b5ed08e9-6f02-4cae-9ba4-78ab3d750bae)
![credentials](https://github.com/user-attachments/assets/af8116f3-0c00-47e6-af34-835e4c1c3cd7)

Step 3: Set Up MongoDB Atlas
1️. Go to MongoDB Atlas → Sign Up (Free)
2️. Choose AWS as the Cloud Provider and Select M0 Free Cluster
3️. Create Cluster
4️. Go to "Database Deployments" → Click "Connect"
5️. Choose "Connect Your Application" and copy the MongoDB Connection String

🔹 Example Connection String:

mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
🔹 Replace <username> and <password> with your actual credentials.
![cluster](https://github.com/user-attachments/assets/98028a01-3cae-438a-87fd-ff9c5e28e2e5)

Step 4: Configure MongoDB in Vercel
1️. Go to Vercel Dashboard → Select Your Project
2️. Click "Settings" → "Environment Variables"
3️. Add a new variable:

Key: MONGO_URI

Value: mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
4️. Click "Save"
5️. Redeploy Your Project
![env variable](https://github.com/user-attachments/assets/4ba541ab-7c5e-405c-94bf-e89934c0136f)

 **Integration Setup: MongoDB Atlas & Vercel**
To automatically sync MongoDB Atlas with Vercel, follow these steps:

 Step 1: Enable Integration in Vercel
Go to Vercel Dashboard → Select Your Project

Click Settings → Integrations

Click "Browse Marketplace"

Search for MongoDB Atlas and select it

Click Install Integration
![clusintegra](https://github.com/user-attachments/assets/bd95c3c4-6254-479a-a3d6-971130695e86)

 Step 2: Connect MongoDB Atlas to Vercel
Login to MongoDB Atlas (MongoDB Atlas)

Select your Database Cluster

Click "Connect" → Select "Connect to Vercel"

Authorize MongoDB to access Vercel

Choose your Vercel project (job-portal-application-vercel)

Click Connect
![integration](https://github.com/user-attachments/assets/e4c88cdb-c665-426e-9293-20b64f89a725)

 MongoDB Atlas is now fully integrated with Vercel! 🎉
