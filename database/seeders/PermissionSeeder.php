<?php

namespace Database\Seeders;

use App\Enums\Permissions\CustomerPermission;
use App\Enums\Permissions\ServicePermission;
use App\Enums\Permissions\RolePermission;
use App\Enums\Permissions\UserPermission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (CustomerPermission::cases() as $permission) {
            \Spatie\Permission\Models\Permission::updateOrCreate(['name' => $permission->key()]);
        }
        foreach (ServicePermission::cases() as $permission) {
            \Spatie\Permission\Models\Permission::updateOrCreate(['name' => $permission->key()]);
        }

        foreach (UserPermission::cases() as $permission) {
            \Spatie\Permission\Models\Permission::updateOrCreate(['name' => $permission->key()]);
        }
        foreach (RolePermission::cases() as $permission) {
            \Spatie\Permission\Models\Permission::updateOrCreate(['name' => $permission->key()]);
        }
    }
}
