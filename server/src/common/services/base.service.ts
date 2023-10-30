import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsWhere,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { CommonEntity } from '../entities';
import { TServiceErrorMessages } from '../types';

export abstract class BaseService<T extends CommonEntity> {
  constructor(
    protected entityRepository: Repository<T>,
    protected serviceErrorMessages: TServiceErrorMessages,
  ) {}

  async findAll(
    options: FindManyOptions<T> = { loadEagerRelations: true },
  ): Promise<T[]> {
    return this.entityRepository.find(options).catch(() => {
      throw new NotFoundException(this.serviceErrorMessages.entitiesNotFound);
    });
  }

  async findOne(
    conditions: FindOptionsWhere<T>,
    options: FindOneOptions<T> = { loadEagerRelations: true },
  ): Promise<T> {
    return this.entityRepository
      .findOneOrFail({
        ...options,
        where: conditions,
      })
      .catch(() => {
        throw new NotFoundException(this.serviceErrorMessages.entityNotFound);
      });
  }

  async createOne(entity: Partial<T>): Promise<T> {
    const entityToCreate = this.entityRepository.create(entity as T);
    const { id } = await this.entityRepository
      .save(entityToCreate)
      .catch(() => {
        throw new BadRequestException(this.serviceErrorMessages.invalidData);
      });
    return this.findOne({ id } as FindOptionsWhere<T>);
  }

  async updateOne(
    conditions: FindOptionsWhere<T>,
    entity: Partial<T>,
  ): Promise<T> {
    const entityToUpdate = await this.findOne(conditions);
    const updatedEntity = this.entityRepository.merge(
      entityToUpdate,
      entity as T,
    );
    const { id } = await this.entityRepository.save(updatedEntity).catch(() => {
      throw new BadRequestException(this.serviceErrorMessages.invalidData);
    });
    return this.findOne({ id } as FindOptionsWhere<T>);
  }

  async deleteOne(conditions: FindOptionsWhere<T>): Promise<T> {
    const entity = await this.findOne(conditions, {
      loadEagerRelations: false,
    });

    return this.entityRepository.remove(entity).catch(() => {
      throw new NotFoundException(this.serviceErrorMessages.entityNotFound);
    });
  }
}
