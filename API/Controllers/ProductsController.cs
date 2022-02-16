using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure.Data;
using Core.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Core.Interfaces;
using Core.Specifications;
using API.DTOS;
using AutoMapper;
using API.Errors;
using Microsoft.AspNetCore.Http;
using API.Helpers;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IGenericRepository<ProductType> _productTypeRepo;
        private readonly IGenericRepository<ProductBrand> _productBrandRepo;
        private readonly IGenericRepository<Product> _productsRepo;
        private readonly IMapper _mapper;

        public ProductsController(IGenericRepository<Product> productsRepo, IGenericRepository<ProductBrand> productBrandRepo, IGenericRepository<ProductType> productTypeRepo, IMapper mapper)
        {
            _mapper = mapper;
            _productsRepo = productsRepo;
            _productBrandRepo = productBrandRepo;
            _productTypeRepo = productTypeRepo;

        }

        [Cached(600)]
        [HttpGet]
        public async Task<ActionResult<Pagination<ProductDTO>>> GetProducts([FromQuery] ProductSpecParams productParams)
        {
            // var spec = new ProductWithTypesAndBrandsSpec(productParams);

            // var products = await _productsRepo.ListAsync(spec);

            // return Ok(_mapper.Map<IReadOnlyList<Product>, IReadOnlyList<ProductDTO>>(products));

            var spec = new ProductWithTypesAndBrandsSpec(productParams);
            var countSpec = new ProductsWithFiltersForCountSpecification(productParams);

            var totalItems = await _productsRepo.CountAsync(countSpec);

            var products = await _productsRepo.ListAsync(spec);

            var data = _mapper.Map<IReadOnlyList<ProductDTO>>(products);

            return Ok(new Pagination<ProductDTO>(productParams.PageIndex,
                productParams.PageSize, totalItems, data));
        }

        [Cached(600)]
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiRespone), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductDTO>> GetProduct(int id)
        {
            var spec = new ProductWithTypesAndBrandsSpec(id);

            var product = await _productsRepo.GetEntityWithSpec(spec);

            if (product == null) return NotFound(new ApiRespone(404));

            return _mapper.Map<Product, ProductDTO>(product);
        }

        [Cached(600)]
        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductsBrands()
        {
            var brands = await _productBrandRepo.GetAllListAsync();

            return Ok(brands);
        }
        
        [Cached(600)]
        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductsTypes()
        {
            var types = await _productTypeRepo.GetAllListAsync();

            return Ok(types);
        }

    }
}