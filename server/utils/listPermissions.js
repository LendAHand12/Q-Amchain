import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "../models/Role.model.js";

dotenv.config();

const listPermissions = async () => {
    try {
        console.log("\n📋 Current Roles and Permissions\n");
        console.log("=".repeat(80));

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB connected\n");

        const roles = await Role.find({ isActive: true }).sort({ name: 1 });

        if (roles.length === 0) {
            console.log("ℹ️  No roles found");
            await mongoose.disconnect();
            return;
        }

        for (const role of roles) {
            console.log(`\n🎭 ${role.name}`);
            console.log(`   Description: ${role.description || "N/A"}`);
            console.log(`   Status: ${role.isActive ? "Active" : "Inactive"}`);
            console.log(`   Default: ${role.isDefault ? "Yes" : "No"}`);
            console.log(`   Permissions (${role.permissions.length}):`);

            if (role.permissions.length > 0) {
                // Group permissions by category
                const grouped = {};
                role.permissions.forEach((perm) => {
                    const [category] = perm.split(".");
                    if (!grouped[category]) {
                        grouped[category] = [];
                    }
                    grouped[category].push(perm);
                });

                Object.keys(grouped)
                    .sort()
                    .forEach((category) => {
                        console.log(`\n      ${category.toUpperCase()}:`);
                        grouped[category].forEach((perm) => {
                            console.log(`         ✓ ${perm}`);
                        });
                    });
            } else {
                console.log("      (No permissions)");
            }

            console.log("\n" + "-".repeat(80));
        }

        console.log("\n✅ Total roles:", roles.length);

        await mongoose.disconnect();
        console.log("✅ MongoDB disconnected\n");
    } catch (error) {
        console.error("\n❌ Error:", error.message);
        process.exit(1);
    }
};

// Run the script
listPermissions();
