import { Repository, Like } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Resource } from '../entities/Resource';
import { CreateResourceRequest, UpdateResourceRequest, ResourceFilters, PaginatedResponse } from '../types';

export class ResourceService {
  private resourceRepository: Repository<Resource>;

  constructor() {
    this.resourceRepository = AppDataSource.getRepository(Resource);
  }

  /**
   * Create a new resource
   */
  async createResource(data: CreateResourceRequest): Promise<Resource> {
    const resource = this.resourceRepository.create({
      name: data.name,
      description: data.description,
      category: data.category,
      status: data.status || 'active',
    });

    return await this.resourceRepository.save(resource);
  }

  /**
   * Get all resources with optional filters and pagination
   */
  async getAllResources(filters: ResourceFilters): Promise<PaginatedResponse<Resource>> {
    const { category, status, search, page = 1, limit = 10 } = filters;

    // Build query
    const queryBuilder = this.resourceRepository.createQueryBuilder('resource');

    if (category) {
      queryBuilder.andWhere('resource.category = :category', { category });
    }

    if (status) {
      queryBuilder.andWhere('resource.status = :status', { status });
    }

    if (search) {
      queryBuilder.andWhere(
        '(resource.name LIKE :search OR resource.description LIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Get paginated data
    const offset = (page - 1) * limit;
    const data = await queryBuilder
      .orderBy('resource.created_at', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get a resource by ID
   */
  async getResourceById(id: number): Promise<Resource | null> {
    return await this.resourceRepository.findOneBy({ id });
  }

  /**
   * Update a resource
   */
  async updateResource(id: number, data: UpdateResourceRequest): Promise<Resource | null> {
    const resource = await this.resourceRepository.findOneBy({ id });

    if (!resource) {
      return null;
    }

    // Check if there are any fields to update
    const hasUpdates = Object.keys(data).length > 0;
    if (!hasUpdates) {
      throw new Error('No fields to update');
    }

    // Update fields
    if (data.name !== undefined) resource.name = data.name;
    if (data.description !== undefined) resource.description = data.description;
    if (data.category !== undefined) resource.category = data.category;
    if (data.status !== undefined) resource.status = data.status;

    return await this.resourceRepository.save(resource);
  }

  /**
   * Delete a resource
   */
  async deleteResource(id: number): Promise<boolean> {
    const result = await this.resourceRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

export const resourceService = new ResourceService();
