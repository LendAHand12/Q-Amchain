import mongoose from "mongoose";
import dotenv from "dotenv";
import Role from "../models/Role.model.js";
import readline from "readline";

dotenv.config();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = (query) => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

const addPermissions = async () => {
    try {
        console.log("\n🚀 Add New Permissions to Roles\n");
        console.log("=".repeat(50));

        // Get feature name
        const featureName = await question(
            "\n📝 Enter feature name (e.g., 'reports', 'analytics'): "
        );

        if (!featureName || !featureName.trim()) {
            console.log("❌ Feature name is required!");
            process.exit(1);
        }

        const feature = featureName.trim().toLowerCase();

        // Ask which permissions to create
        console.log("\n📋 Which permissions do you want to create?");
        const createView = (await question("   - view? (y/n): ")).toLowerCase() === "y";
        const createCreate = (await question("   - create? (y/n): ")).toLowerCase() === "y";
        const createUpdate = (await question("   - update? (y/n): ")).toLowerCase() === "y";
        const createDelete = (await question("   - delete? (y/n): ")).toLowerCase() === "y";

        // Build permissions array
        const newPermissions = [];
        if (createView) newPermissions.push(`${feature}.view`);
        if (createCreate) newPermissions.push(`${feature}.create`);
        if (createUpdate) newPermissions.push(`${feature}.update`);
        if (createDelete) newPermissions.push(`${feature}.delete`);

        if (newPermissions.length === 0) {
            console.log("❌ No permissions selected!");
            process.exit(1);
        }

        console.log("\n✨ Permissions to be created:");
        newPermissions.forEach((perm) => console.log(`   - ${perm}`));

        // Ask which roles to update
        console.log("\n🎭 Which roles should have these permissions?");
        const updateSuperAdmin = (await question("   - Super Admin? (y/n): ")).toLowerCase() === "y";
        const updateOtherRoles = (await question("   - Other existing roles? (y/n): ")).toLowerCase() === "y";

        const confirm = await question("\n⚠️  Proceed with these changes? (y/n): ");
        if (confirm.toLowerCase() !== "y") {
            console.log("❌ Operation cancelled");
            process.exit(0);
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("\n✅ MongoDB connected");

        // Update Super Admin role
        if (updateSuperAdmin) {
            const superAdminRole = await Role.findOne({ name: "Super Admin" });
            if (superAdminRole) {
                let added = 0;
                newPermissions.forEach((perm) => {
                    if (!superAdminRole.permissions.includes(perm)) {
                        superAdminRole.permissions.push(perm);
                        added++;
                    }
                });

                if (added > 0) {
                    await superAdminRole.save();
                    console.log(`✅ Added ${added} permission(s) to Super Admin role`);
                } else {
                    console.log("ℹ️  Super Admin already has all these permissions");
                }
            } else {
                console.log("⚠️  Super Admin role not found");
            }
        }

        // Update other roles
        if (updateOtherRoles) {
            const otherRoles = await Role.find({
                name: { $ne: "Super Admin" },
                isActive: true,
            });

            if (otherRoles.length > 0) {
                console.log(`\n📋 Found ${otherRoles.length} other role(s):`);
                otherRoles.forEach((role, index) => {
                    console.log(`   ${index + 1}. ${role.name}`);
                });

                for (const role of otherRoles) {
                    const shouldUpdate = (
                        await question(`\n   Add permissions to "${role.name}"? (y/n): `)
                    ).toLowerCase() === "y";

                    if (shouldUpdate) {
                        // Ask which specific permissions to add
                        console.log(`   Which permissions for "${role.name}"?`);
                        const permsToAdd = [];

                        for (const perm of newPermissions) {
                            if (!role.permissions.includes(perm)) {
                                const add = (await question(`      - ${perm}? (y/n): `)).toLowerCase() === "y";
                                if (add) {
                                    permsToAdd.push(perm);
                                }
                            }
                        }

                        if (permsToAdd.length > 0) {
                            role.permissions.push(...permsToAdd);
                            await role.save();
                            console.log(`   ✅ Added ${permsToAdd.length} permission(s) to "${role.name}"`);
                        } else {
                            console.log(`   ℹ️  No new permissions added to "${role.name}"`);
                        }
                    }
                }
            } else {
                console.log("\nℹ️  No other roles found");
            }
        }

        console.log("\n" + "=".repeat(50));
        console.log("✅ Permissions added successfully!");
        console.log("\n📝 Next steps:");
        console.log("   1. Add these permissions to server/models/Role.model.js enum:");
        newPermissions.forEach((perm) => console.log(`      "${perm}",`));
        console.log("\n   2. Restart your server to apply changes");
        console.log("\n   3. Use these permissions in your routes:");
        console.log(`      router.get("/${feature}", checkPermission("${feature}.view"), ...)`);

        await mongoose.disconnect();
        console.log("\n✅ MongoDB disconnected");
    } catch (error) {
        console.error("\n❌ Error:", error.message);
        process.exit(1);
    } finally {
        rl.close();
    }
};

// Run the script
addPermissions();
