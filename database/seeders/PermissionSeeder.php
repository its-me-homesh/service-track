<?php

namespace Database\Seeders;

use App\Enums\Permissions\CustomerPermission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = CustomerPermission::values();

        foreach ($permissions as $role) {
            \Spatie\Permission\Models\Permission::updateOrCreate(['name' => $role]);
        }
    }
}
